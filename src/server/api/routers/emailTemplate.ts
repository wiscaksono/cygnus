import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { updateEmailTemplateSchema } from "~/schema/emailTemplate";

export const emailTemplateRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const emailTemplate = await ctx.prisma.emailTemplate.findFirst({
      where: {
        userId: ctx.session?.user.id,
      },
    });

    return {
      status: 200,
      message: "Berhasil mengambil data",
      result: emailTemplate,
    };
  }),

  update: protectedProcedure.input(updateEmailTemplateSchema).mutation(async ({ input, ctx }) => {
    const result = await ctx.prisma.emailTemplate.upsert({
      where: {
        userId: ctx.session?.user.id,
      },
      create: {
        ...input,
        userId: ctx.session?.user.id,
      },
      update: input,
    });

    return {
      status: 200,
      message: "Berhasil mengubah data",
      result: result,
    };
  }),
});
