import { z } from "zod";

export const createCampus = z.object({
  institutionId: z.int(),
  campusName: z
    .string()
    .trim()
    .min(1)
    .max(50)
    .nonempty("Campus name is required"),

  address: z.object({
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    pinCode: z.string(),
  }),
  contactPerson: z.string().trim().optional(),
  contactEmail: z.email().optional(),
  contactPhone: z.string().optional(),
});

export const updateCampus = z.object({
  campusName: z.string().trim().min(1).max(50).optional(),
  address: z
    .object({
      line1: z.string().optional(),
      line2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      pinCode: z.string().optional(),
    })
    .optional(),
  contactPerson: z.string().optional(),
  contactEmail: z.email().optional(),
  contactPhone: z.string().optional(),
});

export const assignAdmin = z.object({
  userId: z.number(),
});

export const campusQueries = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  institutinId: z.string().optional(),
  search: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  sortBy: z.enum(["campusName", "createdAt"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type CreateCampus = z.infer<typeof createCampus>;
export type UpdateCampus = z.infer<typeof updateCampus>;
export type CampusQueries = z.infer<typeof campusQueries>;
export type AssignAdmin = z.infer<typeof assignAdmin>;
