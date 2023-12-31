import z from "zod";

export const sendMessage = z.object({
  id: z.string(),
  number: z.string(),
  message: z.string().optional(),
  token: z.string().optional(),
});

export type ISendMessage = z.infer<typeof sendMessage>;
