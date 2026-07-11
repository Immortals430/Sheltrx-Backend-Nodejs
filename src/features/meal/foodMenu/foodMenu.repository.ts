import { prisma } from "@/lib/prisma";
import type { Prisma } from "generated/prisma/client";

interface CreatePayload {
  hostelId: number;
  mealTypeId: number;
  date: Date;
  foodItem: {
    veg: string[];
    nonVeg: string[];
  };
}

export default class FoodMenuRepository {
  // get food menus
  // async getFoodMenus(
  //   filters: Prisma.FoodMenuWhereInput,
  //   skip: number = 0,
  //   limit: number = 10,
  //   sortBy: "date" | "createdAt" = "date",
  //   sortOrder: "asc" | "desc" = "desc",
  // ) {
  //   return await prisma.foodMenu.findMany({
  //     where: filters,
  //     skip,
  //     take: limit,
  //     orderBy: {
  //       [sortBy]: sortOrder,
  //     },
  //     include: {
  //       mealType: true,
  //       hostel: true,
  //     },
  //   });
  // }

  // // get food menu detail
  async getExisitingFoodMenuDetail(mealTypeId: number, date: Date) {
    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setUTCDate(endDate.getUTCDate() + 1);
    
    return await prisma.foodMenu.findFirst({
      where: {
        mealTypeId,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
    });
  }

  // create food menu
  async createFoodMenu(payload: CreatePayload) {
    return await prisma.foodMenu.create({
      data: {
        hostelId: payload.hostelId,
        mealTypeId: payload.mealTypeId,
        foodItem: payload.foodItem,
        date: payload.date,
      },
    });
  }

  // delete food menu
  // async deleteFoodMenu(foodMenuId: number) {
  //   return await prisma.foodMenu.delete({
  //     where: { id: foodMenuId },
  //   });
  // }
}
