import type { CurrentUser } from "@/types/express";
import type { CreateMealOptOut } from "./mealOptOut.validator";
import MealOptOutRepository from "./mealOptOut.repository";
import TenantRepository from "../../userFeatures/tenant/tenant.repository";
import MealTypeRepository from "../mealType/mealType.repository";
import { ApplicationError } from "@/middleware/errorHandler";
import { Prisma } from "generated/prisma/client";
import MealPreferenceRepository from "../mealPreference/mealPreference.repository";
import HostelRepository from "@/features/organizationFeatures/hostel/hostel.repository";
import MealScanLogRepository from "../qr/repositories/mealScanLog.repository";
import { YYYYMMDDToUTCISO } from "@/lib/dateTime";

export default class MealOptOutService {
  mealOptOutRepository;
  tenantRepository;
  mealTypeRepository;
  mealPreferenceRepository;
  hostelRepository;
  mealScanLogRepository;

  constructor() {
    this.mealOptOutRepository = new MealOptOutRepository();
    this.tenantRepository = new TenantRepository();
    this.mealTypeRepository = new MealTypeRepository();
    this.mealPreferenceRepository = new MealPreferenceRepository();
    this.hostelRepository = new HostelRepository();
    this.mealScanLogRepository = new MealScanLogRepository();
  }

  private validateOptOutDate = (
    targetDate: string,
    targetTime: string,
    timezone: string,
    hours: number,
  ) => {
    const todayInHostelTZ = new Date().toLocaleDateString("en-CA", {
      timeZone: timezone,
    });

    if (targetDate < todayInHostelTZ) {
      throw new ApplicationError("Cannot opt out for a past date", 400);
    }

    const mealDateTimeStr = `${targetDate}T${targetTime}`;
    const mealDateTime = new Date(
      new Date(mealDateTimeStr).toLocaleString("en-US", { timeZone: timezone }),
    );

    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: timezone }),
    );

    const diffMs = mealDateTime.getTime() - now.getTime();
    if (diffMs < hours * 60 * 60 * 1000) {
      throw new ApplicationError(
        "You can opt out of this meal only 6 hours before the meal time",
        400,
      );
    }
  };

  async createMealOptOut(payload: CreateMealOptOut, currentUser: CurrentUser) {
    const tenant = await this.tenantRepository.getTenantDetail({
      filters: { userId: currentUser.userId },
    });

    if (!tenant) {
      throw new ApplicationError("Tenant not found", 404);
    }

    if (!tenant.hostelId) {
      throw new ApplicationError("Tenant hostel not assigned", 400);
    }

    const tenantMealPreference =
      await this.mealPreferenceRepository.getMealPreferenceDetail(
        currentUser.userId,
      );

    if (!tenantMealPreference) {
      throw new ApplicationError("Tenant has no Meal Preference", 400);
    }

    const filters: Prisma.MealTypeWhereInput = {
      id: payload.mealTypeId,
      mealPack: {
        some: {
          mealPreference: {
            some: {
              tenantId: currentUser.userId,
            },
          },
        },
      },
    };

    const mealType = await this.mealTypeRepository.getMealTypeDetail({filters});

    if (!mealType || !mealType.isActive) {
      throw new ApplicationError(
        "This meal type is not part of your meal preference",
        404,
      );
    }

    if (mealType.hostelId !== tenant.hostelId) {
      throw new ApplicationError(
        "This meal type does not belong to your hostel",
        403,
      );
    }

    const hostel = await this.hostelRepository.getHostelDetail(tenant.hostelId);

    if (!hostel) {
      throw new ApplicationError("Hostel not found", 404);
    }

    const consumed = await this.mealScanLogRepository.getMealScanLogDetail({
      filters: {
        tenantId: currentUser.userId,
        mealTypeId: payload.mealTypeId,
        scanDate: YYYYMMDDToUTCISO(payload.date),
      },
    });

    if (consumed) {
      throw new ApplicationError(
        "You have already consumed this meal and cannot opt out",
        400,
      );
    }

    const existing = await this.mealOptOutRepository.getOptOutDetail(
      currentUser.userId,
      payload.mealTypeId,
      payload.date,
    );

    if (existing) {
      throw new ApplicationError(
        "You have already opted out of this meal for this date",
        409,
      );
    }

    this.validateOptOutDate(
      payload.date,
      mealType.startTime,
      hostel.timeZone,
      6,
    );

    const mealOptOut = await this.mealOptOutRepository.createMealOptOut({
      tenantId: currentUser.userId,
      hostelId: tenant.hostelId,
      mealTypeId: payload.mealTypeId,
      date: payload.date,
    });

    return mealOptOut;
  }
}
