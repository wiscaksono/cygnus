import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { createTrackingPelamar, updateTrackingPelamar } from "~/schema/trackingPelamar";

export const trackingPelamarRouter = createTRPCRouter({
  create: protectedProcedure.input(createTrackingPelamar).mutation(async ({ ctx, input }) => {
    const trackingPelamar = await ctx.prisma.trackingPelamar.create({
      data: {
        name: input.name,
        phone: input.phone,
        userId: ctx.session.user.id,
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

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const trackingPelamar = await ctx.prisma.trackingPelamar.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return {
      status: 200,
      message: "Success",
      result: {
        trackingPelamar,
      },
    };
  }),

  update: protectedProcedure.input(updateTrackingPelamar).mutation(async ({ ctx, input }) => {
    const { id, interview1, psikotest, compro, interview2, OJT, hadirOJT, note } = input;

    let updateData = {
      interview1,
      psikotest,
      compro,
      interview2,
      OJT,
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
});
