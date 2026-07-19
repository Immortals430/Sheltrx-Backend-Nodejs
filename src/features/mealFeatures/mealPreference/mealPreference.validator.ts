import { DayCategory, FoodPlan } from "generated/prisma/enums";
import { z } from "zod";

export const mealPreferenceQueries = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

export const createMealPreference = z.object({
  tenantId: z.number(),
  mealPackIds: z.array(z.number()).min(1, "Minimum 1 item required"),
  foodPlan: z
    .array(z.enum(FoodPlan))
    .min(1, "Minimum 1 item required")
    .max(2, "Maximum 2 items allowed"),
  allergies: z.string().optional(),
});

export const updateMealPreference = z.object({
  tenantId: z.coerce.number(),
  mealPackIds: z.array(z.number()).optional(),
  foodPlan: z
    .array(z.enum(FoodPlan))
    .min(1, "Minimum 1 item required")
    .max(2, "Maximum 2 items allowed")
    .optional(),
  allergies: z.string().optional(),
});

export type CreateMealPreference = z.infer<typeof createMealPreference>;
export type UpdateMealPreference = z.infer<typeof updateMealPreference>;
export type MealPreferenceQueries = z.infer<typeof mealPreferenceQueries>;
//
