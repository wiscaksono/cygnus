import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const teamRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
});
