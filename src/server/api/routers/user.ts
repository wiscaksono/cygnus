import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { updateSelf } from "~/schema/user";

export const userRouter = createTRPCRouter({
  getSelf: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session?.user.id,
      },
    });
  }),

  updateSelf: protectedProcedure.input(updateSelf).mutation(async ({ input, ctx }) => {
    const { email, fullName, password, templateWhatsApp } = input;

    const result = await ctx.prisma.user.update({
      where: {
        id: ctx.session?.user.id,
      },
      data: {
        fullName,
        email,
        password,
        templateWhatsApp,
      },
    });

    return {
      status: 200,
      message: "Berhasil mengubah profile",
      result: result,
    };
  }),
});
