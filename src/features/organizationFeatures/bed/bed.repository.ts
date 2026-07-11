import { prisma } from "@/lib/prisma";
import type { Prisma, FoodPlan } from "generated/prisma/client";

interface CreateBedsPayload {
  roomId: number;
  bedNumber: string;
  // foodPlan: FoodPlan;
}

interface UpdateBedPayload {
  bedNumber?: string;
  // foodPlan?: FoodPlan;
}

export default class BedRepository {
  // get beds
  async getBeds(
    filters: Prisma.BedWhereInput,
    skip: number = 0,
    limit: number = 10,
  ) {
    return await prisma.bed.findMany({
      where: filters,
      skip,
      take: limit,
    });
  }

  // get bed details
  async getBedByDetails(bedId: number) {
    return await prisma.bed.findUnique({
      where: { id: bedId },
    });
  }

  // get bed admin
  async getBedAdmin(bedId: number, adminId: number) {
    return await prisma.bed.findUnique({
      where: {
        id: bedId,
        room: {
          hostel: {
            campus: {
              admin: {
                some: {
                  userId: adminId,
                },
              },
            },
          },
        },
      },
    });
  }

  // Bulk create beds using createManyAndReturn for efficiency
  async createBeds(
    payload: CreateBedsPayload[],
    tx?: Prisma.TransactionClient,
  ) {
    return await (tx ?? prisma).bed.createMany({
      data: payload.map((bed) => ({
        roomId: bed.roomId,
        bedNumber: bed.bedNumber,
        // foodPlan: bed.foodPlan,
      })),
    });
  }

  // create single bed
  async createBed(payload: CreateBedsPayload) {
    return await prisma.bed.create({
      data: {
        roomId: payload.roomId,
        bedNumber: payload.bedNumber,
        // foodPlan: payload.foodPlan,
      },
    });
  }

  // update bed
  async updateBed(bedId: number, payload: UpdateBedPayload) {
    return await prisma.bed.update({
      where: { id: bedId },
      data: payload,
    });
  }

  async deleteBed(bedId: number) {
    return await prisma.bed.delete({
      where: { id: bedId },
    });
  }
}
