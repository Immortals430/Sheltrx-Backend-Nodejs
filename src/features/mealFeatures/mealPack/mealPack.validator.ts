import { DayCategory, FoodPlan } from "generated/prisma/enums";
import { z } from "zod";

export const mealPackQueries = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  hostelId: z.coerce.number().optional(),
});

export const createMealPack = z.object({
  hostelId: z.coerce.number(),
  mealPackName: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .nonempty("Meal pack name is required"),
  price: z.number().positive(),
  foodPlan: z.array(z.enum(FoodPlan)).max(2, "Maximum 2 items allowed"),
  dayCategory: z.array(z.enum(DayCategory)).max(2, "Maximum 2 items allowed"),
  mealTypeIds: z.array(z.number()).min(1, "At least one meal type is required"),
});

export const updateMealPack = z.object({
  mealPackName: z.string().trim().min(1).max(100).optional(),
  price: z.number().positive().optional(),
  foodPlan: z
    .array(z.enum(FoodPlan))
    .max(2, "Maximum 2 items allowed")
    .optional(),
  dayCategory: z
    .array(z.enum(DayCategory))
    .max(2, "Maximum 2 items allowed")
    .optional(),
  mealTypeIds: z.array(z.number()).optional(),
});

export type CreateMealPack = z.infer<typeof createMealPack>;
export type UpdateMealPack = z.infer<typeof updateMealPack>;
export type MealPackQueries = z.infer<typeof mealPackQueries>;
