import type { CurrentUser } from "@/types/express";
import type {
  CreateMealPreference,
  MealPreferenceQueries,
  // MealPreferenceQueries,
  UpdateMealPreference,
} from "./mealPreference.validator";
import { Prisma } from "generated/prisma/client";
import MealPreferenceRepository from "./mealPreference.repository";
import { ApplicationError } from "@/middleware/errorHandler";
import UserService from "../../user/user.service";
import HostelRepository from "../../hostel/hostel.repository";
import TenantRepository from "../../tenant/tenant.repository";
import MealPackRepository from "../mealPack/mealPack.repository";
import MealTypeRepository from "../mealType/mealType.repository";

export default class MealPreferenceService {
  mealPreferenceRepository;
  userService;
  hostelRepository;
  tenantRepository;
  mealPackRepository;
  mealTypeRepository;
  constructor() {
    this.mealPreferenceRepository = new MealPreferenceRepository();
    this.mealTypeRepository = new MealTypeRepository();
    this.userService = new UserService();
    this.hostelRepository = new HostelRepository();
    this.tenantRepository = new TenantRepository();
    this.mealPackRepository = new MealPackRepository();
  }

  async getMealPreferences(
    queries: MealPreferenceQueries,
    currentUser: CurrentUser,
  ) {
    const filters: Prisma.MealTypeWhereInput = {
      mealPack: {
        some: {
          mealPreference: {
            some: {
              tenantId: currentUser.userId,
            },
          },
        },
      },
      isActive: true,
    };

    const startDate = new Date(queries.date);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setUTCDate(endDate.getUTCDate() + 1);

    const include: Prisma.MealTypeInclude = {
      foodMenu: {
        where: {
          date: {
            gte: startDate,
            lt: endDate,
          },
        },
      },
    };

    const mealType = await this.mealTypeRepository.getMealTypes({
      filters,
      include,
    });

    return mealType;
  }

  async createMealPreference(
    payload: CreateMealPreference,
    currentUser: CurrentUser,
  ) {
    const tenant = await this.tenantRepository.getTenantDetail(
      payload.tenantId,
    );

    if (!tenant) {
      throw new ApplicationError("Tenant not found", 404);
    }

    if (!tenant.hostelId) {
      throw new ApplicationError("Tenant hostel not assigned", 404);
    }

    if (currentUser.role === "admin") {
      await this.userService.validateHostelAccessForAdmin(
        tenant.hostelId,
        currentUser.userId,
      );
    }

    const mealPreference =
      await this.mealPreferenceRepository.createMealPreference(payload);

    return mealPreference;
  }

  // async updateMealPreference(
  //   mealPreferenceId: number,
  //   currentUser: CurrentUser,
  //   payload: UpdateMealPreference,
  // ) {
  //   const mealPreference =
  //     await this.mealPreferenceRepository.getMealPreferenceDetail(
  //       mealPreferenceId,
  //     );

  //   if (!mealPreference) {
  //     throw new ApplicationError("Meal preference not found", 404);
  //   }

  //   const updatedMealPreference =
  //     await this.mealPreferenceRepository.updateMealPreference(
  //       mealPreferenceId,
  //       {
  //         ...(payload.mealPackId !== undefined && {
  //           mealPackId: payload.mealPackId,
  //         }),
  //         ...(payload.dayCategory !== undefined && {
  //           dayCategory: payload.dayCategory,
  //         }),
  //         ...(payload.isActive !== undefined && { isActive: payload.isActive }),
  //       },
  //     );

  //   return updatedMealPreference;
  // }

  async deleteMealPreference(
    mealPreferenceId: number,
    currentUser: CurrentUser,
  ) {
    // const mealPreference =
    //   await this.mealPreferenceRepository.getMealPreferenceDetail(
    //     mealPreferenceId,
    //   );
    // if (!mealPreference) {
    //   throw new ApplicationError("Meal preference not found", 404);
    // }
    // const deletedMealPreference =
    //   await this.mealPreferenceRepository.deleteMealPreference(
    //     mealPreferenceId,
    //   );
    // return deletedMealPreference;
  }
}
