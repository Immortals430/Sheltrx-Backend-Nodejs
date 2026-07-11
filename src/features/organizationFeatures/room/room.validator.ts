import { z } from "zod";

export const roomQueries = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  hostelId: z.coerce.number().optional(),
  availability: z.enum(["all", "vacant", "occupied"]).optional().default("all"),
  roomTypeName: z.string().optional(),
});


export const createRoom = z.object({
  hostelId: z.coerce.number(),
  roomTypeId: z.coerce.number(),
  roomNumber: z.string(),
  floor: z.string(),
});

export const updateRoom = z.object({
  roomNumber: z.string().optional(),
  floor: z.string().optional(),
});

export type CreateRoom = z.infer<typeof createRoom>;
export type RoomQueries = z.infer<typeof roomQueries>;
export type UpdateRoom = z.infer<typeof updateRoom>;