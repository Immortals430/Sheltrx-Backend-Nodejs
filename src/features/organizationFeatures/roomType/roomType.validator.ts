import { z } from "zod";

export const roomTypeQueries = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  hostelId: z.coerce.number().optional(),
  roomTypeName: z.string().optional(),
});

export type RoomTypeQueries = z.infer<typeof roomTypeQueries>;

export const createRoomType = z.object({
  hostelId: z.coerce.number(),
  roomTypeName: z.string(),
  priceWithFood: z.number().positive(),
  priceWithoutFood: z.number().positive(),
  totalBeds: z.coerce.number(),
  isAc: z.boolean(),
  comment: z.string().optional(),
});

export const updateRoomType = z.object({
  roomTypeName: z.string().optional(),
  priceWithFood: z.number().positive().optional(),
  priceWithoutFood: z.number().positive().optional(),
  totalBeds: z.coerce.number().optional(),
  isAc: z.boolean().optional(),
  comment: z.string().optional(),
});

export type CreateRoomType = z.infer<typeof createRoomType>;
export type UpdatePayload = z.infer<typeof updateRoomType>;
