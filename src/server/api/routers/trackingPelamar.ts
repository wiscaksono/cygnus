import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/id";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("id-ID");

import { createTrackingPelamar, updateTrackingPelamar, deleteTrackingPelamar, filterTrackingPelamarSchema } from "~/schema/trackingPelamar";

export const trackingPelamarRouter = createTRPCRouter({
  getAll: protectedProcedure.input(filterTrackingPelamarSchema).query(async ({ ctx, input }) => {
    const where = input;
    const itemsPerPage = typeof where?.take === "number" ? where?.take : undefined;

    const trackingPelamar = ctx.prisma.trackingPelamar.findMany({
      // take: itemsPerPage === undefined ? undefined : itemsPerPage,
      // skip: itemsPerPage === undefined ? undefined : (where?.currentPage || 1 - 1) * itemsPerPage,
      where: {
        createdAt: {
          gte: where?.createdAt && dayjs(where?.createdAt).isValid() ? dayjs(where?.createdAt).startOf("day").toDate() : undefined,
          lte: where?.createdAt && dayjs(where?.createdAt).isValid() ? dayjs(where?.createdAt).endOf("day").toDate() : undefined,
        },
        userId: ctx.session.user.id,
        name: {
          contains: where?.name,
          mode: "insensitive",
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const count = ctx.prisma.trackingPelamar.count({
      where: {
        userId: ctx.session.user.id,
        createdAt: {
          gte: where?.createdAt && dayjs(where?.createdAt).isValid() ? dayjs(where?.createdAt).startOf("day").toDate() : undefined,
          lte: where?.createdAt && dayjs(where?.createdAt).isValid() ? dayjs(where?.createdAt).endOf("day").toDate() : undefined,
        },
        name: {
          contains: where?.name,
          mode: "insensitive",
        },
      },
    });

    return ctx.prisma.$transaction([trackingPelamar, count]).then(([trackingPelamar, count]) => {
      return {
        status: 200,
        message: "Berhasil mendapatkan data tracking pelamar",
        result: {
          trackingPelamar,
          count,
        },
      };
    });
  }),

  create: protectedProcedure.input(createTrackingPelamar).mutation(async ({ ctx, input }) => {
    const trackingPelamar = await ctx.prisma.trackingPelamar.create({
      data: {
        id: input.id,
        name: input.name,
        phone: input.phone,
        userId: ctx.session.user.id,
        createdAt: input.createdAt,
      },
    });

    await ctx.prisma.pelamar.update({
      where: {
        id: input.id,
      },
      data: {
        onTracking: true,
      },
    });

    return {
      status: 200,
      message: "Berhasil menambahkan ke tracking",
      result: {
        trackingPelamar,
      },
    };
  }),

  update: protectedProcedure.input(updateTrackingPelamar).mutation(async ({ ctx, input }) => {
    const { id, interview1, interview1Date, psikotest, compro, interview2, OJT, OJTDate, hadirOJT, note } = input;

    let updateData = {
      interview1,
      interview1Date,
      psikotest,
      compro,
      interview2,
      OJT,
      OJTDate,
      hadirOJT,
      note,
    };

    if (psikotest === "TIDAK_HADIR") {
      updateData = {
        ...updateData,
        compro: "TIDAK_HADIR",
        interview2: "Tidak Hadir",
        OJT: "TIDAK_HADIR",
        hadirOJT: "TIDAK_HADIR",
      };
    }

    if (compro === "TIDAK_HADIR") {
      updateData = {
        ...updateData,
        interview2: "Tidak Hadir",
        OJT: "TIDAK_HADIR",
        hadirOJT: "TIDAK_HADIR",
      };
    }

    if (OJT === "TIDAK_HADIR") {
      updateData = {
        ...updateData,
        OJT: "TIDAK_HADIR",
        hadirOJT: "TIDAK_HADIR",
      };
    }

    const pelamar = await ctx.prisma.trackingPelamar.update({
      where: {
        id,
      },
      data: updateData,
    });

    return {
      status: 200,
      message: "Berhasil mengupdate data pelamar",
      result: {
        pelamar,
      },
    };
  }),

  delete: protectedProcedure.input(deleteTrackingPelamar).mutation(async ({ ctx, input }) => {
    const { id } = input;

    await ctx.prisma.$transaction(async (prisma) => {
      await prisma.pelamar.update({
        where: {
          id,
        },
        data: {
          onTracking: false,
        },
      });

      await prisma.trackingPelamar.delete({
        where: {
          id,
        },
      });
    });

    return {
      status: 200,
      message: "Berhasil menghapus data pelamar",
    };
  }),
});
