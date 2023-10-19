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
    const pelamars = await ctx.prisma.pelamar.findMany({
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

    const diterima = await ctx.prisma.trackingPelamar.findMany({
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

    const pelamarCounts: Record<string, number> = {};
    const diterimaCounts: Record<string, number> = {};

    pelamars.forEach((item) => {
      const createdAt = new Date(item.createdAt);
      const day = dayjs(createdAt).tz("Asia/Jakarta").locale("id").format("dddd");

      if (pelamarCounts[day]) {
        pelamarCounts[day]++;
      } else {
        pelamarCounts[day] = 1;
      }
    });

    diterima.forEach((item) => {
      const createdAt = new Date(item.createdAt);
      const day = dayjs(createdAt).tz("Asia/Jakarta").locale("id").format("dddd");

      if (diterimaCounts[day]) {
        diterimaCounts[day]++;
      } else {
        diterimaCounts[day] = 1;
      }
    });

    const mergedResults = Object.keys(pelamarCounts).map((day) => ({
      day,
      pelamar: pelamarCounts[day],
      diterima: diterimaCounts[day] || 0, // Handle days with no diterima
    }));

    return {
      status: 200,
      message: "Berhasil mendapatkan data pelelamar",
      result: mergedResults,
    };
  }),

  trackingPelamarMonthly: protectedProcedure.query(async ({ ctx }) => {
    const trackingPelamar = await ctx.prisma.trackingPelamar.findMany();

    return {
      status: 200,
      message: "Berhasil mendapatkan data tracking pelamar",
      result: { trackingPelamarMonthly: trackingPelamar },
    };
  }),
});
