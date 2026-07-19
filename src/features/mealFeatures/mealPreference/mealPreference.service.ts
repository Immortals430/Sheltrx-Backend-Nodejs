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
import UserService from "../../userFeatures/user/user.service";
import HostelRepository from "../../organizationFeatures/hostel/hostel.repository";
import TenantRepository from "../../userFeatures/tenant/tenant.repository";
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

    const include: Prisma.MealTypeInclude = {
      foodMenu: {
        omit: {
          createdAt: true,
          updatedAt: true,
          date: true,
          hostelId: true,
          mealTypeId: true,
        },
        where: {
          date: queries.date,
        },
      },
    };

    const omit: Prisma.MealTypeOmit = {
      createdAt: true,
      updatedAt: true,
      isActive: true,
      deletedAt: true,
    };

    const mealType = await this.mealTypeRepository.getMealTypes({
      filters,
      include,
      omit,
    });

    return mealType;
  }

  async createMealPreference(
    payload: CreateMealPreference,
    currentUser: CurrentUser,
  ) {
    const tenant = await this.tenantRepository.getTenantDetail({
      filters: { userId: payload.tenantId },
    });

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

  async updateMealPreference(
    currentUser: CurrentUser,
    payload: UpdateMealPreference,
  ) {
    const tenant = await this.tenantRepository.getTenantDetail({
      filters: { userId: payload.tenantId },
    });

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

    const updatedMealPreference =
      await this.mealPreferenceRepository.updateMealPreference(
        payload.tenantId,
        {
          ...(payload.allergies !== undefined && {
            allergies: payload.allergies,
          }),
          ...(payload.foodPlan !== undefined && { foodPlan: payload.foodPlan }),
        },

        payload.mealPackIds !== undefined && payload.mealPackIds.length > 0
          ? payload.mealPackIds
          : undefined,
      );

    return updatedMealPreference;
  }
}
