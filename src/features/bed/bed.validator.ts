import { FoodPlan } from "generated/prisma/enums";
import { z } from "zod";

export const bedQueries = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  roomId: z.coerce.number().optional(),
});

// // Single bed schema
// const bedItem = z.object({
//   bedNumber: z.string().min(1, "Bed number is required"),
//   foodPlan: z.enum(["veg", "nonveg"]),
// });

// // Create beds - accepts array for bulk creation
export const createBeds = z.object({
  roomId: z.coerce.number(),
  bedNumber: z.string(),
  // foodPlan: z.enum(FoodPlan),
});

export const updateBed = z.object({
  bedNumber: z.string().optional(),
  // foodPlan: z.enum(FoodPlan).optional(),
});

export type CreateBeds = z.infer<typeof createBeds>;
export type UpdateBed = z.infer<typeof updateBed>;
export type BedQueries = z.infer<typeof bedQueries>;
