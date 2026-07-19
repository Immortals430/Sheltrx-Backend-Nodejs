import { prisma } from "@/config/prisma";
import { UTCISOToYYYYMMDD, YYYYMMDDToUTCISO } from "@/lib/dateTime";
import type { Prisma } from "generated/prisma/client";

interface CreatePayload {
  hostelId: number;
  mealTypeId: number;
  date: string;
  foodItem: {
    veg: string[];
    nonVeg: string[];
  };
}

interface UpdatePayload {
  foodItem: {
    veg: string[];
    nonVeg: string[];
  };
}

export default class FoodMenuRepository {
  // get food menu detail
  async getFoodMenuDetail({ foodMenuId }: { foodMenuId: number }) {
    return await prisma.foodMenu.findUnique({
      where: {
        id: foodMenuId,
      },
    });
  }

  // get food menu detail
  async getExisitingFoodMenuDetail(mealTypeId: number, date: string) {
    const existingFoodMenu = await prisma.foodMenu.findFirst({
      where: {
        mealTypeId,
        date: YYYYMMDDToUTCISO(date),
      },
    });
    if (!existingFoodMenu) return null;
    return {
      ...existingFoodMenu,
      date: UTCISOToYYYYMMDD(existingFoodMenu.date),
    };
  }

  // create food menu
  async createFoodMenu(payload: CreatePayload) {
    const foodMenu = await prisma.foodMenu.create({
      data: {
        hostelId: payload.hostelId,
        mealTypeId: payload.mealTypeId,
        foodItem: payload.foodItem,
        date: YYYYMMDDToUTCISO(payload.date),
      },
    });

    return {
      ...foodMenu,
      date: UTCISOToYYYYMMDD(foodMenu.date),
    };
  }

  // create food menu
  async updateFoodMenu(foodMenuId: number, payload: UpdatePayload) {
    return await prisma.foodMenu.update({
      where: { id: foodMenuId },
      data: payload,
    });
  }

  // delete food menu
  async deleteFoodMenu(foodMenuId: number) {
    return await prisma.foodMenu.delete({
      where: { id: foodMenuId },
    });
  }
}
