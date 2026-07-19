import { prisma } from "@/config/prisma";
import type { Prisma, FoodPlan, DayCategory } from "generated/prisma/client";

interface CreatePayload {
  hostelId: number;
  mealPackName: string;
  price: number;
  foodPlan: FoodPlan[];
  dayCategory: DayCategory[];
  mealTypeIds: number[];
}

interface UpdatePayload {
  mealPackName?: string;
  price?: number;
  foodPlan?: FoodPlan[];
  dayCategory?: DayCategory[];
}

export default class MealPackRepository {
  async getMealPacks(
    filters: Prisma.MealPackWhereInput,

    sortBy: "createdAt" = "createdAt",
    sortOrder: "asc" | "desc" = "desc",
  ) {
    return await prisma.mealPack.findMany({
      where: filters,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });
  }

  // get meal pack detail
  async getMealPackDetail(
    mealPackId: number,
    include: Prisma.MealPackInclude | null = null,
    omit: Prisma.MealPackOmit | null = null,
  ) {
    return prisma.mealPack.findUnique({
      where: { id: mealPackId },
      include,
      omit,
    });
  }

  // create meal pack
  async createMealPack(payload: CreatePayload) {
    return await prisma.mealPack.create({
      data: {
        hostelId: payload.hostelId,
        mealPackName: payload.mealPackName,
        price: payload.price,
        foodPlan: payload.foodPlan,
        dayCategory: payload.dayCategory,
        mealType: {
          connect: payload.mealTypeIds.map((id) => ({ id })),
        },
      },
    });
  }

  // update meal pack
  async updateMealPack(
    mealPackId: number,
    data: UpdatePayload,
    mealTypeIds?: number[],
  ) {
    return await prisma.mealPack.update({
      where: { id: mealPackId },
      data: {
        ...data,
        ...(mealTypeIds && {
          mealType: {
            set: mealTypeIds.map((id) => ({ id })),
          },
        }),
      },
    });
  }

  // delete meal pack
  async deleteMealPack(mealPackId: number) {
    return await prisma.mealPack.delete({
      where: { id: mealPackId },
    });
  }
}
