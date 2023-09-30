import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import dayjs from "dayjs";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/id";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("id-ID");

export const chartRouter = createTRPCRouter({
  pelamarYearly: protectedProcedure.query(async ({ ctx }) => {
    const pelamar = await ctx.prisma.pelamar.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    const countsByMonth: Record<string, number> = {};

    pelamar.forEach((item) => {
      const createdAt = new Date(item.createdAt);
      const month = createdAt.toLocaleString("en-US", { month: "short" }); // Get the short month name

      if (countsByMonth[month]) {
        countsByMonth[month]++;
      } else {
        countsByMonth[month] = 1;
      }
    });

    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const result = monthOrder
      .map((month) => ({
        month,
        total: countsByMonth[month] || 0, // Default to 0 if no data for the month
      }))
      .filter((item) => item.total > 0);

    return {
      status: 200,
      message: "Berhasil mendapatkan data pelelamar",
      result,
    };
  }),

  pelamarWeekly: protectedProcedure.query(async ({ ctx }) => {
    const pelamar = await ctx.prisma.pelamar.findMany({
      where: {
        userId: ctx.session.user.id,
        createdAt: {
          gte: dayjs().tz("Asia/Jakarta").subtract(7, "day").toDate(),
          lte: dayjs().tz("Asia/Jakarta").toDate(),
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const countsByWeek: Record<string, number> = {};

    // Iterate through the test array and count items by month
    pelamar.forEach((item) => {
      const createdAt = new Date(item.createdAt);
      const day = dayjs(createdAt).tz("Asia/Jakarta").locale("id").format("dddd");

      if (countsByWeek[day]) {
        countsByWeek[day]++;
      } else {
        countsByWeek[day] = 1;
      }
    });

    const result = Object.keys(countsByWeek).map((day) => ({
      day,
      total: countsByWeek[day],
    }));

    return {
      status: 200,
      message: "Berhasil mendapatkan data pelelamar",
      result,
    };
  }),
});
