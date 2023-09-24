import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  createPelamarSchema,
  deletePelamarSchema,
  updatePelamarSchema,
} from "~/schema/pelamar";
import { sendMessage } from "~/schema/whatsApp";

import whatsApp from "~/server/whatsApp";

export const pelamarRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.pelamar.findMany();
  }),

  create: protectedProcedure
    .input(createPelamarSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, email, phone, position, interviewDate } = input;

      const phoneExists = await ctx.prisma.pelamar.findFirst({
        where: { phone },
      });

      if (phoneExists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Phone already exists.",
        });
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

      const response = await whatsApp.sendMessage({
        number,
        message,
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
