import { z } from "zod";

export const createMealOptOut = z.object({
  mealTypeId: z.coerce.number(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

export type CreateMealOptOut = z.infer<typeof createMealOptOut>;
