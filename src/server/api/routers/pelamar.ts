import { format } from "date-fns";
import { id } from "date-fns/locale";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  filterPelamarSchema,
  createPelamarSchema,
  deletePelamarSchema,
  updatePelamarSchema,
} from "~/schema/pelamar";
import { sendMessage } from "~/schema/whatsApp";

import whatsApp from "~/server/whatsApp";

export const pelamarRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(filterPelamarSchema)
    .query(async ({ ctx, input }) => {
      const where = input;
      const pelamar = ctx.prisma.pelamar.findMany({
        take: where?.take,
        skip: where?.skip,
        where: {
          invitedByWhatsapp: where?.invitedByWhatsapp,
          hasWhatsapp: where?.hasWhatsapp,
          name: {
            contains: where?.name,
            mode: "insensitive",
          },
        },
      });
      const count = ctx.prisma.pelamar.count({
        where: {
          invitedByWhatsapp: where?.invitedByWhatsapp,
          hasWhatsapp: where?.hasWhatsapp,
          name: {
            contains: where?.name,
            mode: "insensitive",
          },
        },
      });

      return ctx.prisma
        .$transaction([pelamar, count])
        .then(([pelamar, count]) => {
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

  create: protectedProcedure
    .input(createPelamarSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, email, phone, position, interviewDate } = input;

      const phoneExists = await ctx.prisma.pelamar.findFirst({
        where: { phone },
      });

      if (phoneExists) {
        return {
          status: 400,
          message: "Nomor telepon sudah terdaftar",
        };
      }

      const { onwhatsapp } = await whatsApp.checkNumber(phone);

      const result = await ctx.prisma.pelamar.create({
        data: {
          name,
          email,
          phone,
          position,
          hasWhatsapp: onwhatsapp === "true",
          interviewDate,
          userId: ctx.session?.user.id,
        },
      });

      return {
        status: 201,
        message: "Berhasil menambahkan pelamar",
        result: result,
      };
    }),

  update: protectedProcedure
    .input(updatePelamarSchema)
    .mutation(async ({ input, ctx }) => {
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

      let haveWhatsapp = false;

      if (phone) {
        const { onwhatsapp } = await whatsApp.checkNumber(phone);
        haveWhatsapp = onwhatsapp === "true";
      }

      const result = await ctx.prisma.pelamar.update({
        where: {
          id,
        },
        data: {
          name,
          email,
          phone,
          hasWhatsapp: haveWhatsapp,
          position,
          interviewDate,
        },
      });

      return {
        status: 200,
        message: "Berhasil mengubah pelamar",
        result: result,
      };
    }),

  delete: protectedProcedure
    .input(deletePelamarSchema)
    .mutation(async ({ input, ctx }) => {
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

  sendWhatsApp: protectedProcedure
    .input(sendMessage)
    .mutation(async ({ input, ctx }) => {
      const { number, message } = input;

      const pelamar = await ctx.prisma.pelamar.findFirst({
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

      const templateMessage = message
        .replace(/{{name}}/g, pelamar.name)
        .replace(/{{position}}/g, pelamar.position)
        .replace(
          /{{interviewTime}}/g,
          format(pelamar.interviewDate, "hh:mm", { locale: id })
        )
        .replace(
          /{{interviewDate}}/g,
          format(pelamar.interviewDate, "EEEE, dd MMMM yyyy", {
            locale: id,
          })
        );

      const response = await whatsApp.sendMessage({
        number,
        message: templateMessage,
      });

      if (response.status !== "sent") {
        return {
          status: 500,
          message: "Gagal mengirim pesan",
        };
      }

      await ctx.prisma.pelamar.update({
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
    }),
});
