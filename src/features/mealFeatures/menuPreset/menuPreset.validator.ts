import { z } from "zod";

export const menuPresetQueries = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  hostelId: z.coerce.number().optional(),
});

export const createMenuPreset = z.object({
  hostelId: z.coerce.number(),
  menuPresetName: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .nonempty("Menu preset name is required"),
  menuPresetItem: z.object({
    veg: z.array(z.string().trim()),
    nonVeg: z.array(z.string().trim()),
  }),
});

// export const updateMenuPreset = z.object({
//   menuPresetName: z.string().trim().min(1).max(100).optional(),
//   menuPresetItem: z.array(z.string().trim().min(1)).optional(),
// });

export type CreateMenuPreset = z.infer<typeof createMenuPreset>;
// export type UpdateMenuPreset = z.infer<typeof updateMenuPreset>;
export type MenuPresetQueries = z.infer<typeof menuPresetQueries>;
