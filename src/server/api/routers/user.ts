import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { updateSelf } from "~/schema/user";

import whatsApp from "~/server/whatsApp";

export const userRouter = createTRPCRouter({
  getSelf: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session?.user.id,
      },
    });

    const whatsAppDevice = await whatsApp.device({
      token: user?.whatsAppToken || "",
    });

    return {
      status: 200,
      message: "Berhasil mengambil data user",
      result: {
        ...user,
        whatsAppDevice,
      },
    };
  }),

  updateSelf: protectedProcedure.input(updateSelf).mutation(async ({ input, ctx }) => {
    const { email, fullName, password, templateWhatsApp, phone, whatsAppToken } = input;

    const result = await ctx.prisma.user.update({
      where: {
        id: ctx.session?.user.id,
      },
      data: {
        fullName,
        email,
        password,
        phone,
        templateWhatsApp,
        whatsAppToken,
      },
    });

    return {
      status: 200,
      message: "Berhasil mengubah profile",
      result: result,
    };
  }),

  getWhatsAppQR: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session?.user.id,
      },
    });

    const getQR = await whatsApp.getQR({
      token: user?.whatsAppToken || "",
    });

    return {
      status: 200,
      message: "Berhasil mengambil QR Code",
      result: {
        ...getQR,
      },
    };
  }),

  disconnectWhatsApp: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session?.user.id,
      },
    });

    const disconnect = await whatsApp.disconnect({
      token: user?.whatsAppToken || "",
    });

    console.log(disconnect);

    return {
      status: 200,
      message: "Berhasil logout dari WhatsApp",
      result: {
        ...disconnect,
      },
    };
  }),
});
