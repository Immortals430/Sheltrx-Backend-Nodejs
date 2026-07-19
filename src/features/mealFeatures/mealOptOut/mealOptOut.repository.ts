import { prisma } from "@/config/prisma";
import { UTCISOToYYYYMMDD, YYYYMMDDToUTCISO } from "@/lib/dateTime";

interface CreatePayload {
  tenantId: number;
  hostelId: number;
  mealTypeId: number;
  date: string;
}

export default class MealOptOutRepository {
  // create meal opt-out
  async createMealOptOut(payload: CreatePayload) {
    const mealOptOut = await prisma.mealOptOut.create({
      data: {
        tenantId: payload.tenantId,
        hostelId: payload.hostelId,
        mealTypeId: payload.mealTypeId,
        date: YYYYMMDDToUTCISO(payload.date),

      },
    });

    return {
      ...mealOptOut,
      date: UTCISOToYYYYMMDD(mealOptOut.date),
    };
  }

  // get Opt out details
  async getOptOutDetail(tenantId: number, mealTypeId: number, date: string) {
    const mealOptOut = await prisma.mealOptOut.findFirst({
      where: {
        tenantId,
        mealTypeId,
        date: YYYYMMDDToUTCISO(date),
      },
    });
    if (!mealOptOut) return null;
    return {
      ...mealOptOut,
      date: UTCISOToYYYYMMDD(mealOptOut.date),
    };
  }
}
