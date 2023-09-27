import z from "zod";

export const sendMessage = z.object({
  number: z.string(),
  message: z.string().optional(),
});

export type ISendMessage = z.infer<typeof sendMessage>;
