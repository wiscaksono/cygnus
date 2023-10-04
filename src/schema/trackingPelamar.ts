import z from "zod";

const HadirEnum = z.enum(["HADIR", "TIDAK_HADIR", "PENDING"]);

export const createTrackingPelamar = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
});

export const updateTrackingPelamar = z.object({
  id: z.string(),
  interview1: z.string().or(z.null()),
  psikotest: HadirEnum,
  compro: HadirEnum,
  interview2: z.string().or(z.null()),
  OJT: HadirEnum,
  OJTDate: z.date().or(z.null()),
  hadirOJT: HadirEnum,
  note: z.string().or(z.null()),
});

export type IcreateTrackingPelamar = z.infer<typeof updateTrackingPelamar>;
export type IUpdateTrackingPelamar = z.infer<typeof updateTrackingPelamar>;
