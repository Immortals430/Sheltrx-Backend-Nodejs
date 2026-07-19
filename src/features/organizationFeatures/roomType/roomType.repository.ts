import { prisma } from "@/config/prisma";
import type { Prisma } from "generated/prisma/client";

interface CreatePayload {
  hostelId: number;
  roomTypeName: string;
  priceWithFood: number;
  priceWithoutFood: number;
  totalBeds: number;
  isAc: boolean;
  comment?: string | undefined;
}

interface UpdatePayload {
  hostelId?: number;
  roomTypeName?: string;
  priceWithFood?: number;
  priceWithoutFood?: number;
  totalBeds?: number;
  isAc?: boolean;
  comment?: string;
}

export default class RoomTypeRepository {
  async getRoomTypes(
    filters: Prisma.RoomTypeWhereInput,
    skip: number = 0,
    limit: number = 10,
    sortBy: "createdAt" = "createdAt",
    sortOrder: "asc" | "desc" = "desc",
  ) {
    return await prisma.roomType.findMany({
      where: filters,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });
  }

  // get room type detail
  async getRoomTypeDetail(roomTypeId: number) {
    return await prisma.roomType.findUnique({
      where: { id: roomTypeId },
    });
  }

  // create room type
  async createRoomType(payload: CreatePayload) {
    return await prisma.roomType.create({
      data: {
        hostelId: payload.hostelId,
        roomTypeName: payload.roomTypeName,
        priceWithFood: payload.priceWithFood,
        priceWithoutFood: payload.priceWithoutFood,
        totalBeds: payload.totalBeds,
        isAc: payload.isAc,
        comment: payload.comment ?? null,
      },
    });
  }

  async deleteRoomType(roomTypeId: number) {
    return await prisma.roomType.delete({
      where: { id: roomTypeId },
    });
  }

  async updateRoomType(roomTypeId: number, data: UpdatePayload) {
    return await prisma.roomType.update({
      where: { id: roomTypeId },
      data: data,
    });
  }
}
