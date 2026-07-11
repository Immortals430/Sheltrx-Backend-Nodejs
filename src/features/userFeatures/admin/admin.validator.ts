import { z } from "zod";

export const adminQueries = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  campusId: z.coerce.number().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["campusName", "createdAt"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type AdminQueries = z.infer<typeof adminQueries>;
