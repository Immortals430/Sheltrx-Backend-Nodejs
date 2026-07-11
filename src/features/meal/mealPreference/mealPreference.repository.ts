import { prisma } from "@/lib/prisma";
import type { Prisma, DayCategory, FoodPlan } from "generated/prisma/client";

interface CreatePayload {
  tenantId: number;
  mealPackIds: number[];
  foodPlan: FoodPlan[];
  allergies?: string | undefined;
  // dayCategory: DayCategory;
  // isActive?: boolean;
}

interface UpdatePayload {
  mealPackIds?: number[];
  dayCategory?: DayCategory;
  isActive?: boolean;
}

export default class MealPreferenceRepository {
//   async getMealPreferences(
//     filters: Prisma.MealPreferenceWhereInput,
//     skip: number = 0,
//     limit: number = 10,
//     sortBy: "createdAt" = "createdAt",
//     sortOrder: "asc" | "desc" = "desc",
//   ) {
//     return await prisma.mealPreference.findMany({
//       where: filters,
//       skip,
//       take: limit,
//       orderBy: {
//         [sortBy]: sortOrder,
//       },
//       include: {
//         tenant: true,
//         mealPack: true,
//       },
//     });
//   }

  // get meal preference detail
  async getMealPreferenceDetail(
    filter: Prisma.MealPreferenceWhereUniqueInput,
    include: Prisma.MealPreferenceInclude | null = null,
    omit: Prisma.MealPreferenceOmit | null = null,
  ) {
    return await prisma.mealPreference.findUnique({
      where: filter,
      include,
      omit,
    });
  }

  // create meal preference
  async createMealPreference(payload: CreatePayload) {
    return await prisma.mealPreference.create({
      data: {
        tenantId: payload.tenantId,
        foodPlan: payload.foodPlan,
        allergies: payload.allergies ?? null,
        mealPack: {
          connect: payload.mealPackIds.map((id) => ({ id })),
        },
      },
    });
  }

  // update meal preference
  // async updateMealPreference(mealPreferenceId: number, data: UpdatePayload) {
  //   return await prisma.mealPreference.update({
  //     where: { id: mealPreferenceId },
  //     data,
  //     include: {
  //       tenant: true,
  //       mealPack: true,
  //     },
  //   });
  // }

  // delete meal preference
  async deleteMealPreference(mealPreferenceId: number) {
    return await prisma.mealPreference.delete({
      where: { id: mealPreferenceId },
    });
  }
}
