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
    invitedByEmail: z.boolean().optional(),
    hasWhatsapp: z.boolean().optional(),
    createdAt: z.date().optional(),
  })
  .optional();

export const createPelamarSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  position: z.string(),
  interviewDate: z.date(),
  hasWhatsapp: z.boolean().optional(),
  portal: z.string(),
});

export const createManyPelamarSchema = z.array(createPelamarSchema);

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

export const deleteAllPelamarSchema = z.array(z.string());

export type IFilterPelamar = z.infer<typeof filterPelamarSchema>;
export type ICreatePelamar = z.infer<typeof createPelamarSchema>;
export type ICreateManyPelamar = z.infer<typeof createManyPelamarSchema>;
export type IUpdatePelamar = z.infer<typeof updatePelamarSchema>;
export type IDeletePelamar = z.infer<typeof deletePelamarSchema>;
export type IDeleteAllPelamar = z.infer<typeof deleteAllPelamarSchema>;
