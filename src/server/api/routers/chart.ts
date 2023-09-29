import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const chartRouter = createTRPCRouter({
  pelelamar: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.pelamar.findMany();

    const countsByMonth: Record<string, number> = {};

    result.forEach((item) => {
      const createdAt = new Date(item.createdAt);
      const month = createdAt.toLocaleString("en-US", { month: "short" });

      if (countsByMonth[month]) {
        countsByMonth[month]++;
      } else {
        countsByMonth[month] = 1;
      }
    });

    const output = Object.keys(countsByMonth).map((month) => ({
      month,
      total: countsByMonth[month],
    }));

    return {
      status: 200,
      message: "Berhasil mendapatkan data pelelamar",
      result: output,
    };
  }),
});
