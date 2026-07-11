import type { CurrentUser } from "@/types/express";
import type {
  CreateMealPack,
  MealPackQueries,
  UpdateMealPack,
} from "./mealPack.validator";
import { Prisma } from "generated/prisma/client";
import MealPackRepository from "./mealPack.repository";
import HostelRepository from "../../organizationFeatures/hostel/hostel.repository";
import { ApplicationError } from "@/middleware/errorHandler";
import UserService from "../../userFeatures/user/user.service";

export default class MealPackService {
  mealPackRepository;
  hostelRepository;
  userService;

  constructor() {
    this.mealPackRepository = new MealPackRepository();
    this.hostelRepository = new HostelRepository();
    this.userService = new UserService();
  }

  async getMealPacks(
    { page, limit, hostelId }: MealPackQueries,
    currentUser: CurrentUser,
  ) {
    const skip = (page - 1) * limit;

    let filters: Prisma.MealPackWhereInput = {
      ...(hostelId && { hostelId }),

      ...(currentUser.role === "admin" && {
        hostel: {
          campus: {
            admin: {
              some: {
                userId: currentUser.userId,
              },
            },
          },
        },
      }),
    };

    const mealPacks = await this.mealPackRepository.getMealPacks(
      filters,
      skip,
      limit,
    );

    return mealPacks;
  }

  async createMealPack(payload: CreateMealPack, currentUser: CurrentUser) {
    const hostel = await this.hostelRepository.getHostelDetail(
      payload.hostelId,
    );

    if (!hostel) throw new ApplicationError("Hostel not found", 404);

    if (currentUser.role === "admin") {
      await this.userService.validateHostelAccessForAdmin(
        payload.hostelId,
        currentUser.userId,
      );
    }

    const mealPack = await this.mealPackRepository.createMealPack(payload);

    return mealPack;
  }

  async updateMealPack(
    mealPackId: number,
    currentUser: CurrentUser,
    payload: UpdateMealPack,
  ) {
    const mealPack =
      await this.mealPackRepository.getMealPackDetail(mealPackId);

    if (!mealPack) throw new ApplicationError("Meal pack not found", 404);

    if (currentUser.role === "admin") {
      await this.userService.validateHostelAccessForAdmin(
        mealPack.hostelId,
        currentUser.userId,
      );
    }

    const updatedMealPack = await this.mealPackRepository.updateMealPack(
      mealPackId,
      {
        ...(payload.mealPackName !== undefined && {
          mealPackName: payload.mealPackName,
        }),
        ...(payload.price !== undefined && { price: payload.price }),
        ...(payload.foodPlan !== undefined && { foodPlan: payload.foodPlan }),
        ...(payload.dayCategory !== undefined && {
          dayCategory: payload.dayCategory,
        }),
      },
      payload.mealTypeIds,
    );

    return updatedMealPack;
  }

  async deleteMealPack(mealPackId: number, currentUser: CurrentUser) {
    const mealPack =
      await this.mealPackRepository.getMealPackDetail(mealPackId);

    if (!mealPack) throw new ApplicationError("Meal pack not found", 404);

    if (currentUser.role === "admin") {
      await this.userService.validateHostelAccessForAdmin(
        mealPack.hostelId,
        currentUser.userId,
      );
    }

    const deletedMealPack =
      await this.mealPackRepository.deleteMealPack(mealPackId);

    return deletedMealPack;
  }
}
