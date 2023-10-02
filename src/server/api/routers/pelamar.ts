const Sib = require("@getbrevo/brevo") as TBrevo;
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/id";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("id-ID");

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { filterPelamarSchema, createPelamarSchema, deletePelamarSchema, updatePelamarSchema, deleteAllPelamarSchema, createManyPelamarSchema } from "~/schema/pelamar";
import { sendMessage } from "~/schema/whatsApp";
import { sendEmail } from "~/schema/email";
import whatsApp from "~/server/whatsApp";
import { emailTemplate } from "~/components/EmailTemplate";

import type { TBrevo } from "~/types/brevo";

export const pelamarRouter = createTRPCRouter({
  getAll: publicProcedure.input(filterPelamarSchema).query(async ({ ctx, input }) => {
    const where = input;

    const pelamar = ctx.prisma.pelamar.findMany({
      take: typeof where?.take === "number" ? where?.take : undefined,
      skip: where?.skip,
      where: {
        createdAt: {
          gte: where?.createdAt && dayjs(where?.createdAt).isValid() ? dayjs(where?.createdAt).startOf("day").toDate() : undefined,
          lte: where?.createdAt && dayjs(where?.createdAt).isValid() ? dayjs(where?.createdAt).endOf("day").toDate() : undefined,
        },
        userId: ctx.session?.user.id,
        hasWhatsapp: where?.hasWhatsapp === true ? true : undefined,
        invitedByWhatsapp: where?.invitedByWhatsapp === true ? true : undefined,
        invitedByEmail: where?.invitedByEmail === true ? true : undefined,
        name: {
          contains: where?.name,
          mode: "insensitive",
        },
      },
    });

    const count = ctx.prisma.pelamar.count({
      where: {
        createdAt: {
          gte: where?.createdAt && dayjs(where?.createdAt).isValid() ? dayjs(where?.createdAt).startOf("day").toDate() : undefined,
          lte: where?.createdAt && dayjs(where?.createdAt).isValid() ? dayjs(where?.createdAt).endOf("day").toDate() : undefined,
        },
        userId: ctx.session?.user.id,
        hasWhatsapp: where?.hasWhatsapp === true ? true : undefined,
        invitedByWhatsapp: where?.invitedByWhatsapp === true ? true : undefined,
        invitedByEmail: where?.invitedByEmail === true ? true : undefined,
        name: {
          contains: where?.name,
          mode: "insensitive",
        },
      },
    });

    return ctx.prisma.$transaction([pelamar, count]).then(([pelamar, count]) => {
      return {
        status: 200,
        message: "Berhasil mendapatkan data pelamar",
        result: {
          pelamar,
          count,
        },
      };
    });
  }),

  create: protectedProcedure.input(createPelamarSchema).mutation(async ({ input, ctx }) => {
    const { name, email, phone, position, interviewDate, portal } = input;

    const result = await ctx.prisma.$transaction(async (prisma) => {
      const phoneExists = await prisma.pelamar.findFirst({
        where: { phone },
      });

      if (phoneExists) {
        return {
          status: 400,
          message: "Nomor telepon sudah terdaftar",
        };
      }

      const user = await prisma.user.findFirst({
        where: {
          id: ctx.session?.user.id,
        },
      });

      if (!user?.whatsAppToken) {
        return {
          status: 400,
          message: "Token WhatsApp tidak ditemukan",
        };
      }

      const isValid = await whatsApp.validate({
        token: user?.whatsAppToken,
        target: phone,
      });

      const hasWhatsapp = isValid.registered.includes(`62${phone.replace(/^0+/, "")}`);

      const createdPelamar = await prisma.pelamar.create({
        data: {
          portal,
          name,
          email,
          phone,
          position,
          hasWhatsapp,
          interviewDate,
          userId: ctx.session?.user.id,
        },
      });

      return {
        status: 201,
        message: "Berhasil menambahkan pelamar",
        result: createdPelamar,
      };
    });

    return result;
  }),

  createMany: protectedProcedure.input(createManyPelamarSchema).mutation(async ({ input, ctx }) => {
    return ctx.prisma.$transaction(async (prisma) => {
      const pelamars = input.map((pelamar) => {
        return {
          ...pelamar,
          userId: ctx.session?.user.id,
        };
      });

      const isExists = await prisma.pelamar.findMany({
        where: {
          phone: {
            in: pelamars.map((pelamar) => pelamar.phone),
          },
        },
      });

      if (isExists.length > 0) {
        return {
          status: 400,
          message: `Nomor telepon ${isExists.map((pelamar) => pelamar.phone).join(", ")} sudah terdaftar`,
        };
      }

      const result = await prisma.pelamar.createMany({
        data: pelamars,
      });

      return {
        status: 201,
        message: "Berhasil menambahkan pelamar",
        result: result,
      };
    });
  }),

  update: protectedProcedure.input(updatePelamarSchema).mutation(async ({ input, ctx }) => {
    const { id, name, email, phone, position, interviewDate } = input;

    const phoneExists = await ctx.prisma.pelamar.findFirst({
      where: { phone },
    });

    if (phoneExists) {
      return {
        status: 400,
        message: "Nomor telepon sudah terdaftar",
      };
    }

    const result = await ctx.prisma.pelamar.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        phone,
        hasWhatsapp: true,
        position,
        interviewDate,
      },
    });

    return {
      status: 201,
      message: "Berhasil mengubah pelamar",
      result: result,
    };
  }),

  delete: protectedProcedure.input(deletePelamarSchema).mutation(async ({ input, ctx }) => {
    const { id } = input;

    const result = await ctx.prisma.pelamar.delete({
      where: {
        id,
      },
    });

    return {
      status: 200,
      message: "Berhasil menghapus pelamar",
      result: result,
    };
  }),

  deleteAll: protectedProcedure.input(deleteAllPelamarSchema).mutation(async ({ ctx, input }) => {
    const result = await ctx.prisma.pelamar.deleteMany({
      where: {
        id: {
          in: input,
        },
      },
    });

    return {
      status: 200,
      message: "Berhasil menghapus semua pelamar",
      result: result,
    };
  }),

  sendWhatsApp: protectedProcedure.input(sendMessage).mutation(async ({ input, ctx }) => {
    const { number } = input;

    try {
      await ctx.prisma.$transaction(async (prisma) => {
        const pelamar = await prisma.pelamar.findFirst({
          where: {
            phone: number,
          },
        });

        if (!pelamar) {
          return {
            status: 404,
            message: "Pelamar tidak ditemukan",
          };
        }

        const user = await prisma.user.findFirst({
          where: {
            id: ctx.session?.user.id,
          },
        });

        if (!user) {
          return {
            status: 404,
            message: "Template tidak ditemukan",
          };
        }

        const templateMessage = user.templateWhatsApp
          .replace(/{{namaPelamar}}/g, pelamar.name)
          .replace(/{{position}}/g, pelamar.position)
          .replace(/{{namaPengirim}}/g, ctx.session?.user.fullName)
          .replace(/{{interviewTime}}/g, dayjs(pelamar.interviewDate).tz("Asia/Jakarta").format("h:mm"))
          .replace(/{{interviewDate}}/g, dayjs(pelamar.interviewDate).tz("Asia/Jakarta").format("dddd, DD MMMM YYYY"));

        if (!user.whatsAppToken) {
          return {
            status: 400,
            message: "Token WhatsApp tidak ditemukan",
          };
        }

        await whatsApp.sendMessage({
          number,
          token: user.whatsAppToken,
          message: templateMessage,
        });

        await prisma.pelamar.update({
          where: {
            phone: number,
          },
          data: {
            invitedByWhatsapp: true,
          },
        });

        return {
          status: 200,
          message: "Berhasil mengirim pesan",
        };
      });
    } catch (error) {
      // Handle any errors that occur during the transaction
      console.error("Error in Prisma transaction:", error);
      return {
        status: 500,
        message: "Internal server error",
      };
    }

    return {
      status: 200,
      message: "Berhasil mengirim pesan",
    };
  }),

  sendEmail: protectedProcedure.input(sendEmail).mutation(async ({ ctx, input }) => {
    const templateEmail = await ctx.prisma.emailTemplate.findFirst({
      where: {
        userId: ctx.session?.user.id,
      },
    });

    if (!templateEmail) {
      return {
        status: 404,
        message: "Template tidak ditemukan",
      };
    }

    const brevo = Sib;
    const client = brevo.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = templateEmail.brevoApiKey;
    const transEmailApi = new brevo.TransactionalEmailsApi();

    const sender = {
      email: templateEmail.senderEmail,
      name: templateEmail.sender,
    };

    const { email, namaPelamar, position, interviewDate, portal } = input;

    const receivers = [{ email }];

    const htmlContent = emailTemplate
      .replace(/{{namaPelamar}}/g, namaPelamar)
      .replace(/{{position}}/g, position)
      .replace(/{{namaPengirim}}/g, ctx.session?.user.fullName)
      .replace(/{{whatsApp}}/g, ctx.session?.user.phone.replace(/(\d{4})(\d{4})(\d{4})/, "$1-$2-$3"))
      .replace(/{{portal}}/g, portal)
      .replace(/{{whatsAppUrl}}/g, `https://wa.me/+62${ctx.session?.user.phone.replace(/^0+/, "")}`)
      .replace(/{{interviewTime}}/g, dayjs(interviewDate).tz("Asia/Jakarta").format("h:mm"))
      .replace(/{{interviewDate}}/g, dayjs(interviewDate).tz("Asia/Jakarta").format("dddd, DD MMMM YYYY"));

    try {
      transEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: templateEmail.subject,
        htmlContent,
      });
    } catch (error) {
      console.log(error);
    }

    await ctx.prisma.pelamar.updateMany({
      where: {
        email,
      },
      data: {
        invitedByEmail: true,
      },
    });

    return {
      status: 200,
      message: "Berhasil mengirim email",
    };
  }),
});
