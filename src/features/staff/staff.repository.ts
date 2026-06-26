import { prisma } from "@/lib/prisma";
import {
  Prisma,
  type Gender,
  type StaffRoleType,
} from "generated/prisma/browser";

interface StaffDetail {
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
  roleType: StaffRoleType | undefined;
}

export default class StaffRepository {
  async createStaff(
    userId: number,
    aadhaarId: number,
    staffDetail: StaffDetail,
    tx: Prisma.TransactionClient,
  ) {
    return (tx ?? prisma).staff.create({
      data: {
        userId,
        aadhaarId,
        gender: staffDetail.gender,
        dob: staffDetail.dob ?? null,
        profilePhoto: staffDetail.profilePhoto ?? null,
        alternateNumber: staffDetail.alternateNumber ?? null,
        address: staffDetail.address ?? Prisma.DbNull,
        comment: staffDetail.comment ?? null,
        roleType: staffDetail.roleType ?? null,
      },
    });
  }

  async getStaff(
    filters: Prisma.StaffWhereInput,
    skip: number = 0,
    limit: number = 10,
  ) {
    return await prisma.staff.findMany({
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
