// import { z } from "zod";

// export const bedQueries = z.object({
//   page: z.coerce.number().optional().default(1),
//   limit: z.coerce.number().optional().default(10),
//   roomId: z.coerce.number().optional(),
//   foodPlan: z.enum(["veg", "nonveg"]).optional(),
//   availability: z.enum(["all", "vacant", "occupied"]).optional().default("all"),
// });

// // Single bed schema
// const bedItem = z.object({
//   bedNumber: z.string().min(1, "Bed number is required"),
//   foodPlan: z.enum(["veg", "nonveg"]),
// });

// // Create beds - accepts array for bulk creation
// export const createBeds = z.object({
//   roomId: z.coerce.number(),
//   beds: z
//     .array(bedItem)
//     .min(1, "At least one bed is required")
//     .max(20, "Cannot create more than 20 beds at once"),
// });

// export const updateBed = z.object({
//   bedNumber: z.string().min(1).optional(),
//   foodPlan: z.enum(["veg", "nonveg"]).optional(),
// });

// export type CreateBeds = z.infer<typeof createBeds>;
// export type UpdateBed = z.infer<typeof updateBed>;
// export type BedQueries = z.infer<typeof bedQueries>;
