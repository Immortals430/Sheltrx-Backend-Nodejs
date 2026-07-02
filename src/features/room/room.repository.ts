import { prisma } from "@/lib/prisma";
import type { Prisma } from "generated/prisma/client";


interface CreatePayload {
  hostelId: number;
  roomTypeId: number;
  roomNumber: string;
  floor: string;
}

interface UpdatePayload {
  roomNumber?: string;
  floor?: string;
}

export default class RoomRepository {
  async getRooms(
    filters: Prisma.RoomWhereInput,
    skip: number = 0,
    limit: number = 10,
    sortBy: "createdAt" = "createdAt",
    sortOrder: "asc" | "desc" = "desc",
  ) {
    return await prisma.room.findMany({
      where: filters,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });
  }

  // get room details
  async getRoomDetails(roomId: number) {
    return await prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });
  }

  // create room
  async createRoom(payload: CreatePayload, tx?: Prisma.TransactionClient) {
    return await (tx ?? prisma).room.create({
      data: {
        hostelId: payload.hostelId,
        roomTypeId: payload.roomTypeId,
        roomNumber: payload.roomNumber,
        floor: payload.floor,
      },
      include: {
        roomType: true,
      },
    });
  }

  // delete room
  async deleteRoom(roomId: number) {
    return await prisma.room.delete({
      where: {
        id: roomId,
      },
    });
  }

  async updateRoom(roomId: number, data: UpdatePayload) {
    return await prisma.room.update({
      where: {
        id: roomId,
      },
      data,
    });
  }
}
