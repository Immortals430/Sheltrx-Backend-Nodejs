import { prisma } from "@/lib/prisma";
import type { Prisma, FoodPlan } from "generated/prisma/client";

interface CreateBedsPayload {
  roomId: number;
  bedNumber: string;
  foodPlan: FoodPlan;
}

interface UpdateBedPayload {
  bedNumber?: string;
  foodPlan?: FoodPlan;
}

export default class BedRepository {
  async getBeds(
    filters: Prisma.BedWhereInput,
    skip: number = 0,
    limit: number = 10,
    sortBy: "createdAt" = "createdAt",
    sortOrder: "asc" | "desc" = "desc",
  ) {
    return await prisma.bed.findMany({
      where: filters,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        room: true,
        tenant: true,
      },
    });
  }

  async getBedById(id: number) {
    return await prisma.bed.findUnique({
      where: { id },
      include: {
        room: true,
        tenant: true,
      },
    });
  }

  // Bulk create beds using createManyAndReturn for efficiency
  async createBeds(payload: CreateBedsPayload[], tx?: Prisma.TransactionClient) {
    return await (tx ?? prisma).bed.createMany({
      data: payload.map((bed) => ({
        roomId: bed.roomId,
        bedNumber: bed.bedNumber,
        foodPlan: bed.foodPlan,
      })),
    });
  }

  async updateBed(id: number, payload: UpdateBedPayload) {
    return await prisma.bed.update({
      where: { id },
      data: payload,
    });
  }

  async deleteBed(id: number) {
    return await prisma.bed.delete({
      where: { id },
    });
  }
}
