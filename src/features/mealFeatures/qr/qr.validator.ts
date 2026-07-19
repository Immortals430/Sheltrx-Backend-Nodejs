import { z } from "zod";

export const createQr = z.object({
  hostelId: z.coerce.number(),
});

export const getQrs = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  campusId: z.coerce.number().optional(),
});

export const scanQr = z.object({
  token: z.string().nonempty("Qr token is required"),
});

export type CreateQr = z.infer<typeof createQr>;
export type GetQrs = z.infer<typeof getQrs>;
export type ScanQr = z.infer<typeof scanQr>;
