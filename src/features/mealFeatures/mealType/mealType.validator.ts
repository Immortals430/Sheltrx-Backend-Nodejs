import { z } from "zod";

export const mealTypeQueries = z.object({
  // page: z.coerce.number().optional().default(1),
  // limit: z.coerce.number().optional().default(10),
  hostelId: z.coerce.number().optional(),
});

export const createMealType = z.object({
  hostelId: z.coerce.number(),
  mealTypeName: z
    .string()
    .trim()
    .min(1)
    .max(50)
    .nonempty("Meal type name is required"),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .nonempty("Start time is required"),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .nonempty("End time is required"),
});

export const updateMealType = z.object({
  mealTypeName: z.string().trim().min(1).max(50).optional(),

  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional(),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional(),
});

export type CreateMealType = z.infer<typeof createMealType>;
export type UpdateMealType = z.infer<typeof updateMealType>;
export type MealTypeQueries = z.infer<typeof mealTypeQueries>;
