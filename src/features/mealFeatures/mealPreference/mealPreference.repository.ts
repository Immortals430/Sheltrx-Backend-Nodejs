import { prisma } from "@/config/prisma";
import type { Prisma, DayCategory, FoodPlan } from "generated/prisma/client";

interface CreatePayload {
  tenantId: number;
  mealPackIds: number[];
  foodPlan: FoodPlan[];
  allergies?: string | undefined;
  // dayCategory: DayCategory;
}

interface UpdatePayload {
  foodPlan?: FoodPlan[];
  allergies?: string;
}

export default class MealPreferenceRepository {
  // get meal preference detail
  async getMealPreferenceDetail(
    tenantId: number,
    include: Prisma.MealPreferenceInclude | null = null,
    omit: Prisma.MealPreferenceOmit | null = null,
  ) {
    return await prisma.mealPreference.findUnique({
      where: { tenantId },
      include: include,
      omit: omit,
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
  async updateMealPreference(
    tenantId: number,
    data?: UpdatePayload,
    mealPackIds?: number[],
  ) {
    return await prisma.mealPreference.update({
      where: { tenantId },
      data: {
        ...data,
        ...(mealPackIds && {
          mealPack: {
            set: mealPackIds.map((id) => ({ id })),
          },
        }),
      },
      include: {
        tenant: true,
        mealPack: true,
      },
    });
  }
}
