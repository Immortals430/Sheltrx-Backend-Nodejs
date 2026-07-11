import { HostelType, OrganizationType } from "generated/prisma/enums";
import { z } from "zod";

export const createHostel = z.object({
  campusId: z.int(),
  hostelName: z
    .string()
    .trim()
    .min(1)
    .max(50)
    .nonempty("Hostel name is required"),
  address: z.object({
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    pinCode: z.string(),
  }),
  hostelType: z.enum(HostelType),
  organizationType: z.enum(OrganizationType),
  // // totalRooms
  // // adminName
  // // adminUserId
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  totalFloors: z.string().optional(),
});

export const updateHostel = z.object({
  hostelName: z.string().trim().min(1).max(50).optional(),
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
  hostelType: z.enum(HostelType).optional(),
  organizationType: z.enum(OrganizationType).optional(),
  // // totalRooms
  // // adminName
  // // adminUserId
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  totalFloors: z.string().optional(),
});

export const hostelQueries = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  campusId: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["hostelName", "createdAt"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type CreateHostel = z.infer<typeof createHostel>;
export type UpdateHostel = z.infer<typeof updateHostel>;
export type HostelQueries = z.infer<typeof hostelQueries>;
