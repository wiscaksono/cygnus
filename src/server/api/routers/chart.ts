import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const chartRouter = createTRPCRouter({
  pelamar: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.pelamar.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    const countsByMonth: Record<string, number> = {};
    const countsByDay: Record<string, number> = {};

    // Iterate through the test array and count items by month
    result.forEach((item) => {
      const createdAt = new Date(item.createdAt);
      const month = createdAt.toLocaleString("en-US", { month: "short" }); // Get the short month name

      if (countsByMonth[month]) {
        countsByMonth[month]++;
      } else {
        countsByMonth[month] = 1;
      }
    });

    result.forEach((item) => {
      const createdAt = new Date(item.createdAt);
      const dayKey = createdAt.toISOString().split("T")[0] || ""; // Get the date in YYYY-MM-DD format

      if (countsByDay[dayKey]) {
        countsByDay[dayKey]++;
      } else {
        countsByDay[dayKey] = 1;
      }
    });

    // Define the order of months
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Create the output in the desired format and sort by month
    const monthly = monthOrder.map((month) => ({
      month,
      total: countsByMonth[month] || 0, // Default to 0 if no data for the month
    }));

    const daily = Object.keys(countsByDay).map((dayKey) => ({
      day: dayKey,
      total: countsByDay[dayKey],
    }));

    return {
      status: 200,
      message: "Berhasil mendapatkan data pelelamar",
      result: {
        monthly,
        daily,
      },
    };
  }),
});
