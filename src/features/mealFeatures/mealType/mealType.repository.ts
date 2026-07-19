import { prisma } from "@/config/prisma";
import { HHMMSSToUTCISO, UTCISOToHHMMSS } from "@/lib/dateTime";
import type { Prisma } from "generated/prisma/client";

interface CreatePayload {
  hostelId: number;
  mealTypeName: string;
  startTime: string;
  endTime: string;
}

interface UpdatePayload {
  mealTypeName?: string;
  startTime?: string;
  endTime?: string;
}

interface GetMealTypePayload {
  filters: Prisma.MealTypeWhereInput;
  include?: Prisma.MealTypeInclude | null;
  omit?: Prisma.MealTypeOmit | null;
  sortBy?: "startTime";
  sortOrder?: "asc" | "desc";
}

interface GetDetailPayload {
  filters: Prisma.MealTypeWhereInput;
  include?: Prisma.MealTypeInclude | null;
  omit?: Prisma.MealTypeOmit | null;
}

export default class MealTypeRepository {
  async getMealTypes({
    filters,
    include = null,
    omit = null,
    sortBy = "startTime",
    sortOrder = "asc",
  }: GetMealTypePayload) {
    const mealTypes = await prisma.mealType.findMany({
      where: filters,
      include,
      omit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return mealTypes.map((mealType) => ({
      ...mealType,
      startTime: UTCISOToHHMMSS(mealType.startTime),
      endTime: UTCISOToHHMMSS(mealType.endTime),
    }));
  }

  // get meal type detail
  async getMealTypeDetail({
    filters = {},
    include = null,
    omit = null,
  }: GetDetailPayload) {
    const mealType = await prisma.mealType.findFirst({
      where: filters,
      include,
      omit,
    });

    if (!mealType) return null;

    return {
      ...mealType,
      startTime: UTCISOToHHMMSS(mealType.startTime),
      endTime: UTCISOToHHMMSS(mealType.endTime),
    };
  }

  // create meal type
  async createMealType(payload: CreatePayload) {
    const mealType = await prisma.mealType.create({
      data: {
        hostelId: payload.hostelId,
        mealTypeName: payload.mealTypeName,
        startTime: HHMMSSToUTCISO(payload.startTime),
        endTime: HHMMSSToUTCISO(payload.endTime),
      },
    });

    return {
      ...mealType,
      startTime: UTCISOToHHMMSS(mealType.startTime),
      endTime: UTCISOToHHMMSS(mealType.endTime),
    };
  }

  // update meal type
  async updateMealType(mealTypeId: number, data: UpdatePayload) {
    const updatedMealType = await prisma.mealType.update({
      where: { id: mealTypeId },
      data: {
        ...data,
        ...(data.startTime && { startTime: HHMMSSToUTCISO(data.startTime) }),
        ...(data.endTime && { endTime: HHMMSSToUTCISO(data.endTime) }),
      },
    });
    return {
      ...updatedMealType,
      startTime: UTCISOToHHMMSS(updatedMealType.startTime),
      endTime: UTCISOToHHMMSS(updatedMealType.endTime),
    };
  }

  // delete meal type
  async deleteMealType(mealTypeId: number) {
    return await prisma.mealType.update({
      where: { id: mealTypeId },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });
  }
}
