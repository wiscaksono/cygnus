import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

import { registerSchema } from "~/schema/auth";

export const authRouter = createTRPCRouter({
  register: publicProcedure.input(registerSchema).mutation(async ({ input, ctx }) => {
    const { fullName, email, password, phone } = input;

    const exists = await ctx.prisma.user.findFirst({
      where: { email },
    });

    if (exists) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "User already exists.",
      });
    }

    const image = `https://api.multiavatar.com/${fullName}.svg`;

    await ctx.prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        password,
        image,
        templateWhatsApp: "Tempalte whatsapp",
      },
    });

    return {
      status: 201,
      message: "Account created successfully",
    };
  }),
});
