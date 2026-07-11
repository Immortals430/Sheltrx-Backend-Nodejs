import type { CurrentUser } from "@/types/express";
import type {
  CreateMealType,
  MealTypeQueries,
  UpdateMealType,
} from "./mealType.validator";
import { Prisma } from "generated/prisma/client";
import MealTypeRepository from "./mealType.repository";
import HostelRepository from "../../organizationFeatures/hostel/hostel.repository";
import { ApplicationError } from "@/middleware/errorHandler";
import UserService from "../../userFeatures/user/user.service";

export default class MealTypeService {
  mealTypeRepository;
  hostelRepository;
  userService;
  constructor() {
    this.mealTypeRepository = new MealTypeRepository();
    this.hostelRepository = new HostelRepository();
    this.userService = new UserService();
  }

  async getMealTypes({ hostelId }: MealTypeQueries, currentUser: CurrentUser) {
    let filters: Prisma.MealTypeWhereInput = {
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

      ...(currentUser.role === "warden" && {
        hostel: {
          warden: {
            some: {
              userId: currentUser.userId,
            },
          },
        },
      }),

      ...(currentUser.role === "staff" && {
        hostel: {
          staff: {
            some: {
              userId: currentUser.userId,
            },
          },
        },
      }),
    };

    const mealTypes = await this.mealTypeRepository.getMealTypes({ filters });

    return mealTypes;
  }

  async createMealType(payload: CreateMealType, currentUser: CurrentUser) {
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
    const mealType = await this.mealTypeRepository.createMealType(payload);

    return mealType;
  }

  async updateMealType(
    mealTypeId: number,
    currentUser: CurrentUser,
    payload: UpdateMealType,
  ) {
    const mealType =
      await this.mealTypeRepository.getMealTypeDetail(mealTypeId);

    if (!mealType) throw new ApplicationError("Meal type not found", 404);

    if (currentUser.role === "admin") {
      await this.userService.validateHostelAccessForAdmin(
        mealType.hostelId,
        currentUser.userId,
      );
    }

    const updatedMealType = await this.mealTypeRepository.updateMealType(
      mealTypeId,
      {
        ...(payload.mealTypeName !== undefined && {
          mealTypeName: payload.mealTypeName,
        }),
        ...(payload.startTime !== undefined && {
          startTime: payload.startTime,
        }),
        ...(payload.endTime !== undefined && {
          endTime: payload.endTime,
        }),
      },
    );

    return updatedMealType;
  }

  async deleteMealType(mealTypeId: number, currentUser: CurrentUser) {
    const mealType =
      await this.mealTypeRepository.getMealTypeDetail(mealTypeId);

    if (!mealType) throw new ApplicationError("Meal type not found", 404);

    if (currentUser.role === "admin") {
      await this.userService.validateHostelAccessForAdmin(
        mealType.hostelId,
        currentUser.userId,
      );
    }

    const deletedMealType =
      await this.mealTypeRepository.deleteMealType(mealTypeId);

    return deletedMealType;
  }
}
