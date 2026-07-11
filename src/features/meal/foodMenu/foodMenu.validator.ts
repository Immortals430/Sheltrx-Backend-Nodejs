import { z } from "zod";

export const foodMenuQueries = z.object({
  // page: z.coerce.number().optional().default(1),
  // limit: z.coerce.number().optional().default(10),
  // hostelId: z.coerce.number().optional(),
  // mealTypeId: z.coerce.number().optional(),
  // date: z.coerce.date().optional(),
});

export const createFoodMenu = z.object({
  hostelId: z.coerce.number(),
  mealTypeId: z.coerce.number(),
  menuPresetId: z.coerce.number().optional(),
  customFoodItem: z.object({
    veg: z.array(z.string().trim()),
    nonVeg: z.array(z.string().trim()),
  }).optional(),
  date: z.coerce.date(),
});

export const updateFoodMenu = z.object({
  // hostelId: z.coerce.number(),
  // mealTypeId: z.coerce.number(),
  // foodItem: z.object({
  //   veg: z.array(z.string().trim()),
  //   nonVeg: z.array(z.string().trim()),
  // }),
  // date: z.coerce.date(),
});

export type CreateFoodMenu = z.infer<typeof createFoodMenu>;
export type UpdateFoodMenu = z.infer<typeof updateFoodMenu>;
export type FoodMenuQueries = z.infer<typeof foodMenuQueries>;
