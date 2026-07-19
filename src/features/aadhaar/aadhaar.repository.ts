import { prisma } from "@/config/prisma";
import type { Prisma } from "generated/prisma/browser";

export default class AadhaarRepository {
  async createAadhaar(
    aadhaarNumber: string | undefined,
    tx?: Prisma.TransactionClient,
  ) {
    return await (tx ?? prisma).aadhaar.create({
      data: {
        aadhaarNumber: aadhaarNumber ?? null,
      },
    });
  }
}
