import { prisma } from "@/config/prisma";
import { Prisma, type Gender } from "generated/prisma/browser";

interface WardenDetail {
  gender: Gender;
  dob: string | undefined;
  profilePhoto: string | undefined;
  alternateNumber: string | undefined;
  address:
    | {
        line1: string;
        line2?: string | undefined;
        city: string;
        state: string;
        country: string;
        pinCode: string;
      }
    | undefined;
  comment: string | undefined;
}

export default class WardenRepository {
  async createWarden(
    userId: number,
    aadhaarId: number,
    wardenDetail: WardenDetail,
    tx: Prisma.TransactionClient,
  ) {
    return (tx ?? prisma).warden.create({
      data: {
        userId,
        aadhaarId,
        gender: wardenDetail.gender,
        dob: wardenDetail.dob ?? null,
        profilePhoto: wardenDetail.profilePhoto ?? null,
        alternateNumber: wardenDetail.alternateNumber ?? null,
        address: wardenDetail.address ?? Prisma.DbNull,
        comment: wardenDetail.comment ?? null,
      },
    });
  }

  async getWardens(
    filters: Prisma.WardenWhereInput,
    skip: number = 0,
    limit: number = 10,
  ) {
    return await prisma.warden.findMany({
      where: filters,
      include: {
        user: {
          select: {
            username: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
      skip,
      take: limit,
    });
  }
}
