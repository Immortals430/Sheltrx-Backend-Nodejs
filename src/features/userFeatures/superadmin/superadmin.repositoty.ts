import { prisma } from "@/config/prisma";
import type { Prisma } from "@prisma/client/extension";

export default class SuperAdminRepository {
  async createSuperAdmin(userId: number, tx?: Prisma.TransactionClient) {
    return await (tx ?? prisma).superAdmin.create({
      data: {
        userId,
      },
    });
  }

  // async findAdminByUserId(userId: number) {
  //   return await prisma.admin.findUnique({
  //     where: {
  //       userId,
  //     },
  //   });
  // }
}
