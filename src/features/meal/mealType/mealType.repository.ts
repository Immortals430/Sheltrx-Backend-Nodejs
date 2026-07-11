import { prisma } from "@/lib/prisma";
import type { Prisma } from "generated/prisma/client";

interface CreatePayload {
  hostelId: number;
  mealTypeName: string;
  startTime: string;
  endTime: string;
}

interface UpdatePayload {
  mealTypeName?: string;
  startTime?: string;
  endTime?: string;
}

interface GetMealTypePayload {
  filters: Prisma.MealTypeWhereInput;
  include?: Prisma.MealTypeInclude | null;
  sortBy?: "startTime";
  sortOrder?: "asc" | "desc";
}

export default class MealTypeRepository {
  async getMealTypes({
    filters,
    include = null,
    sortBy = "startTime",
    sortOrder = "asc",
  }: GetMealTypePayload) {
    return await prisma.mealType.findMany({
      where: filters,
      include,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });
  }

  // get meal type detail
  async getMealTypeDetail(mealTypeId: number) {
    return await prisma.mealType.findUnique({
      where: { id: mealTypeId },
    });
  }

  // create meal type
  async createMealType(payload: CreatePayload) {
    return await prisma.mealType.create({
      data: {
        hostelId: payload.hostelId,
        mealTypeName: payload.mealTypeName,
        startTime: payload.startTime,
        endTime: payload.endTime,
      },
    });
  }

  // update meal type
  async updateMealType(mealTypeId: number, data: UpdatePayload) {
    return await prisma.mealType.update({
      where: { id: mealTypeId },
      data,
    });
  }

  // delete meal type
  async deleteMealType(mealTypeId: number) {
    return await prisma.mealType.update({
      where: { id: mealTypeId },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });
  }
}
