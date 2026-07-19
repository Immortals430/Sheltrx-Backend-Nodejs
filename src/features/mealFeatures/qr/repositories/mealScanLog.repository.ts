import { prisma } from "@/config/prisma";
import { YYYYMMDDToUTCISO } from "@/lib/dateTime";
import type { Prisma } from "generated/prisma/client";

interface CreatePayload {
  tenantId: number;
  hostelId: number;
  mealTypeId: number;
  scanDate: string;
}

interface GetDetailPayload {
  filters: Prisma.MealScanLogWhereInput;
  omit?: Prisma.MealScanLogOmit | null;
}

export default class MealScanLogRepository {
  async createMealScanLog(payload: CreatePayload) {
    return await prisma.mealScanLog.create({
      data: {
        tenantId: payload.tenantId,
        hostelId: payload.hostelId,
        mealTypeId: payload.mealTypeId,
        scanDate: YYYYMMDDToUTCISO(payload.scanDate),
      },
    });
  }

  async getMealScanLogDetail({
    filters,
    omit = null,
  }: GetDetailPayload) {
    return await prisma.mealScanLog.findFirst({
      where: filters,
      omit,
    });
  }
}
