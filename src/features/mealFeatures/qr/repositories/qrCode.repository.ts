import { prisma } from "@/config/prisma";
import type { Prisma } from "generated/prisma/client";

interface UpsertPayload {
  hostelId: number;
  qrToken: string;
  qrUrl: string;
}

interface GetPayload {
  filters?: Prisma.QrCodeWhereInput | {};
  include?: Prisma.QrCodeInclude | null;
  omit?: Prisma.QrCodeOmit | null;
  skip?: number;
  limit?: number;
  sortBy?: "createdAt";
  sortOrder?: "asc" | "desc";
}

interface GetDetailPayload {
  filters?: Prisma.QrCodeWhereInput | {};
  include?: Prisma.QrCodeInclude | null;
  omit?: Prisma.QrCodeOmit | null;
}

export default class QrRepository {
  // upsert qr code — creates if not exists, updates if exists
  async upsertQr(payload: UpsertPayload) {
    return await prisma.qrCode.upsert({
      where: { hostelId: payload.hostelId },
      create: {
        hostelId: payload.hostelId,
        qrToken: payload.qrToken,
        qrUrl: payload.qrUrl,
      },
      update: {
        qrToken: payload.qrToken,
        qrUrl: payload.qrUrl,
      },
    });
  }

  async getQrs({
    filters = {},
    include = null,
    omit = null,
    skip = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  }: GetPayload) {
    return await prisma.qrCode.findMany({
      where: filters,
      include,
      omit,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });
  }

  async getQrDetail({ filters = {}, include = null, omit = null }: GetDetailPayload) {
    return await prisma.qrCode.findFirst({
      where: filters,
      include,
      omit,
    });
  }
}
