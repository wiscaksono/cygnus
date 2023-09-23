import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

import {
  createPelamarSchema,
  deletePelamarSchema,
  updatePelamarSchema,
} from "~/schema/pelamar";

export const pelamarRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.pelamar.findMany({
      where: {
        userId: ctx.session?.user.id,
      },
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
        throw new TRPCError({
          code: "CONFLICT",
          message: "Phone already exists.",
        });
      }

      const result = await ctx.prisma.pelamar.create({
        data: {
          name,
          email,
          phone,
          position,
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

      const result = await ctx.prisma.pelamar.update({
        where: {
          id,
        },
        data: {
          name,
          email,
          phone,
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
});
