import z from "zod";

export const updateSelf = z.object({
  fullName: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(4).optional(),
  templateWhatsApp: z.string().optional(),
});

export type IUpdateSelf = z.infer<typeof updateSelf>;
