import { prisma } from "@/config/prisma";
import { AdminSubscriptionPlan, Prisma } from "generated/prisma/client";

// import type { CreateAdmin } from "./admin.validator";

interface AdminDetail {
  billingAddress: string | undefined;
  subscriptionPlan: AdminSubscriptionPlan;
  profilePhoto: string | undefined;
}

export default class AdminRepository {
  async createAdmin(
    userId: number,
    aadhaarId: number,
    adminDetail: AdminDetail,
    tx?: Prisma.TransactionClient,
  ) {
    return await (tx ?? prisma).admin.create({
      data: {
        userId,
        aadhaarId,
        billingAddress: adminDetail.billingAddress ?? null,
        subscriptionPlan: adminDetail.subscriptionPlan,
        profilePhoto: adminDetail.profilePhoto ?? null,
      },
    });
  }

  async getAdmins(
    filters: Prisma.AdminWhereInput,
    skip: number = 0,
    limit: number = 10,
  ) {
    return await prisma.admin.findMany({
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

  async getAdminDetail(userId: number, includeHostel = false) {
    return await prisma.admin.findUnique({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            phoneNumber: true,
            role: true,
          },
        },
        ...(includeHostel && {
          campus: {
            include: {
              hostel: true,
            },
          },
        }),
      },
    });
  }
}
