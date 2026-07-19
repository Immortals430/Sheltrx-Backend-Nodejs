import { prisma } from "@/config/prisma";
import type {
  CreateInstitution,
  UpdateInstitution,
} from "./institution.validatior";
import { Prisma, type Institution } from "generated/prisma/browser";

interface UpdatePayload {
  institutionName?: string;
  contactEmail?: string;
  contactPhone?: string;
  adminName?: string;
  adminEmail?: string;
  adminPhone?: string;
  logo?: string;
  isActive?: boolean;
  address?: {
    line1: string | null;
    line2: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    pinCode: string | null;
  };
  comment?: string;
}

export default class InstitutionRepository {
  async createInstitution(payload: CreateInstitution) {
    return await prisma.institution.create({
      data: {
        institutionName: payload.institutionName,
        contactEmail: payload.contactEmail ?? null,
        contactPhone: payload.contactPhone ?? null,
        adminName: payload.adminName ?? null,
        adminEmail: payload.adminEmail ?? null,
        adminPhone: payload.adminPhone ?? null,
        logo: payload.logo ?? null,
        isActive: payload.isActive ?? true,
        address: payload.address ?? Prisma.DbNull,
        comment: payload.comment ?? null,
      },
    });
  }

  async getInstitution(
    userId: number | null = null,
    search: string | null = null,
    skip: number = 0,
    limit: number = 10,
  ) {
    return await prisma.institution.findMany({
      where: {
        ...(search && {
          institutionName: { startsWith: search, mode: "insensitive" },
        }),

        ...(userId && {
          campus: {
            some: {
              admin: {
                some: {
                  userId,
                },
              },
            },
          },
        }),
      },

      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });
  }

  async getInstitutionDetail(institutionId: number) {
    return await prisma.institution.findUnique({
      where: {
        id: institutionId,
      },
    });
  }

  async updateInstitution(institutionId: number, payload: UpdatePayload) {
    return await prisma.institution.update({
      where: {
        id: institutionId,
      },
      data: payload,
    });
  }

  async deleteInstitution(institutionId: number) {
    return await prisma.institution.delete({
      where: {
        id: institutionId,
      },
    });
  }
}
