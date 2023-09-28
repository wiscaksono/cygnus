import z from "zod";

export const updateEmailTemplateSchema = z.object({
  sender: z.string(),
  senderEmail: z.string().email(),
  jobPortal: z.string(),
  subject: z.string(),
});

export type IUpdateEmailTemplate = z.infer<typeof updateEmailTemplateSchema>;
