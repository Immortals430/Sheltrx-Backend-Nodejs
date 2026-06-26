import { z } from "zod";

export const createInstitution = z.object({
  institutionName: z
    .string()
    .trim()
    .min(1)
    .max(50)
    .nonempty("Institution name is required"),
  contactEmail: z.email().optional(),
  contactPhone: z.string().optional(),
  adminName: z.string().optional(),
  adminEmail: z.string().optional(),
  adminPhone: z.string().optional(),
  logo: z.string().optional(),
  isActive: z.boolean().optional(),
  address: z
    .object({
      line1: z.string(),
      line2: z.string().optional(),
      city: z.string(),
      state: z.string(),
      country: z.string(),
      pinCode: z.string(),
    })
    .optional(),
  comment: z.string().optional(),
});

export const updateInstitution = z.object({
  institutionName: z.string().trim().min(1).max(50).optional(),
  contactEmail: z.email().optional(),
  contactPhone: z.string().optional(),
  adminName: z.string().optional(),
  adminEmail: z.string().optional(),
  adminPhone: z.string().optional(),
  logo: z.string().optional(),
  isActive: z.boolean().optional(),
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
  comment: z.string().optional(),
});

export const institutionQueries = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
});

export type CreateInstitution = z.infer<typeof createInstitution>;
export type UpdateInstitution = z.infer<typeof updateInstitution>;
export type GetInstitutionQueries = z.infer<typeof institutionQueries>;
