import { z } from "zod";


export const wardenQueries = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  hostelId: z.coerce.number().optional(),
  search: z.string().optional(),
//   sortBy: z.enum([ "createdAt"]).optional().default("createdAt"),
//   sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type WardenQueries = z.infer<typeof wardenQueries>;
