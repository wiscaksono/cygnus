import z from "zod";

const HadirEnum = z.enum(["HADIR", "TIDAK_HADIR", "PENDING"]);

export const createTrackingPelamar = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  createdAt: z.date(),
});

export const updateTrackingPelamar = z.object({
  id: z.string(),
  interview1: z.string().or(z.null()),
  interview1Date: z.date().or(z.null()),
  psikotest: HadirEnum,
  compro: HadirEnum,
  interview2: z.string().or(z.null()),
  OJT: HadirEnum,
  OJTDate: z.date().or(z.null()),
  hadirOJT: HadirEnum,
  note: z.string().or(z.null()),
});

export const deleteTrackingPelamar = z.object({
  id: z.string(),
});

export const filterTrackingPelamarSchema = z
  .object({
    take: z.number().or(z.string()).optional(),
    name: z.string().optional(),
    createdAt: z.date().optional(),
    currentPage: z.number().optional(),
  })
  .optional();

export type IcreateTrackingPelamar = z.infer<typeof updateTrackingPelamar>;
export type IUpdateTrackingPelamar = z.infer<typeof updateTrackingPelamar>;
export type IDeleteTrackingPelamar = z.infer<typeof deleteTrackingPelamar>;
export type IFilterTrackingPelamar = z.infer<typeof filterTrackingPelamarSchema>;
