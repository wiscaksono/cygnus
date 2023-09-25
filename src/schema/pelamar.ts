import z from "zod";

export const filterPelamarSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    position: z.string().optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    invitedByWhatsapp: z.boolean().optional(),
    hasWhatsapp: z.boolean().optional(),
  })
  .optional();

export const createPelamarSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  position: z.string(),
  interviewDate: z.date(),
});

export const updatePelamarSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  position: z.string().optional(),
  interviewDate: z.string().or(z.date()).optional(),
});

export const deletePelamarSchema = z.object({
  id: z.string(),
});

export type IFilterPelamar = z.infer<typeof filterPelamarSchema>;
export type ICreatePelamar = z.infer<typeof createPelamarSchema>;
export type IUpdatePelamar = z.infer<typeof updatePelamarSchema>;
export type IDeletePelamar = z.infer<typeof deletePelamarSchema>;
