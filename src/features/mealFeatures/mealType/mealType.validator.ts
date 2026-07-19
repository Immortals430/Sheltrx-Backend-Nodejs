import { z } from "zod";

const timeSchema = z
  .string()
  .regex(
    /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, // 24 hour format
    "Invalid time format (HH:MM or HH:MM:SS)",
  )
  .transform((val) => (val.length === 5 ? `${val}:00` : val)); // normalize to HH:MM:SS

export const mealTypeQueries = z.object({
  hostelId: z.coerce.number().optional(),
});

export const createMealType = z
  .object({
    hostelId: z.coerce.number(),
    mealTypeName: z
      .string()
      .trim()
      .min(1)
      .max(50)
      .nonempty("Meal type name is required"),
    startTime: timeSchema,
    endTime: timeSchema,
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "startTime must be before endTime",
    path: ["endTime"],
  });

export const updateMealType = z
  .object({
    mealTypeName: z.string().trim().min(1).max(50).optional(),
    startTime: timeSchema.optional(),
    endTime: timeSchema.optional(),
  })
  
  

export type CreateMealType = z.infer<typeof createMealType>;
export type UpdateMealType = z.infer<typeof updateMealType>;
export type MealTypeQueries = z.infer<typeof mealTypeQueries>;
