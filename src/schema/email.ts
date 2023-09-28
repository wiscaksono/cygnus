import z from "zod";

export const sendEmail = z.object({
  email: z.string().email(),
  namaPelamar: z.string(),
  position: z.string(),
  interviewDate: z.date(),
  message: z.string().optional(),
});

export type ISendEmail = z.infer<typeof sendEmail>;
