import { DayCategory, FoodPlan } from "generated/prisma/enums";
import { z } from "zod";

export const mealPreferenceQueries = z.object({
  //   mealPackId: z.coerce.number().optional(),
  //   dayCategory: z.enum(DayCategory).optional(),
  //   isActive: z.coerce.boolean().optional(),
  date: z.coerce.date(),
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
  mealPackIds: z.array(z.number()).min(1, "Minimum 1 item required").optional(),
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
