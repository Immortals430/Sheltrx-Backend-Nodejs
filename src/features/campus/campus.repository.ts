import { prisma } from "@/lib/prisma";
import type { CreateCampus } from "./campus.validatior";
import { Prisma } from "generated/prisma/browser";
// import { Prisma } from "generated/prisma/client";

interface CreatePayload {
  campusName: string;
  address: {
    line1: string;
    line2?: string | undefined;
    country: string;
    state: string;
    city: string;
    pinCode: string;
  };
  contactPerson?: string | undefined;
  contactEmail?: string | undefined;
  contactPhone?: string | undefined;
  country: string;
  state: string;
  city: string;
}

interface UpdatePayload {
  campusName?: string;
  address?: {
    line1: string | null;
    line2: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    pinCode: string | null;
  };
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  country?: string;
  state?: string;
  city?: string;
}
export default class CampusRepository {
  async createCampus(
    institutionId: number,
    campusCode: string,
    payload: CreatePayload,
  ) {
    return await prisma.campus.create({
      data: {
        institutionId: institutionId,
        campusName: payload.campusName,
        campusCode: campusCode,
        address: payload.address,
        contactPerson: payload.contactPerson ?? null,
        contactEmail: payload.contactEmail ?? null,
        contactPhone: payload.contactPhone ?? null,
        country: payload.address.country,
        state: payload.address.state,
        city: payload.address.city,
      },
    });
  }

  async getCampus(
    filters: Prisma.CampusWhereInput,
    skip: number = 0,
    limit: number = 10,
    sortBy: "campusName" | "createdAt" = "createdAt",
    sortOrder: "asc" | "desc" = "desc",
  ) {
    return await prisma.campus.findMany({
      where: filters,
      skip: skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });
  }

  async getCampusDetail(campusId: number) {
    return await prisma.campus.findUnique({
      where: {
        id: campusId,
      },
    });
  }

  async updateCampus(campusId: number, payload: UpdatePayload) {
    return await prisma.campus.update({
      where: {
        id: campusId,
      },
      data: payload,
    });
  }

  async deleteCampus(campusId: number) {
    return await prisma.campus.delete({
      where: {
        id: campusId,
      },
    });
  }

  async assignAdmin(campusId: number, adminId: number) {
    return await prisma.campus.update({
      where: {
        id: campusId,
      },
      data: {
        admin: {
          connect: {
            userId: adminId,
          },
        },
      },
    });
  }

  async removeAdmin(campusId: number, adminId: number) {
    return await prisma.campus.update({
      where: {
        id: campusId,
      },
      data: {
        admin: {
          disconnect: {
            userId: adminId,
          },
        },
      },
    });
  }
}
