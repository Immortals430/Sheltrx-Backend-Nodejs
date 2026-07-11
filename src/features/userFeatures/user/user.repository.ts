import { prisma } from "@/lib/prisma.js";
import type { Role } from "generated/prisma/enums.js";
import type { Prisma } from "@prisma/client/extension";

export default class UserRepository {
  async findUserByPhone(phoneNumber: string) {
    return await prisma.user.findUnique({
      where: {
        phoneNumber,
      },
    });
  }

  async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createUser(
    userDetail: {
      email: string;
      username: string;
      role: Role;
      phoneNumber: string;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return await (tx ?? prisma).user.create({
      data: {
        email: userDetail.email,
        username: userDetail.username,
        role: userDetail.role,
        phoneNumber: userDetail.phoneNumber,
      },
    });
  }

  async getUserDetail(userId: number) {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
      omit: {
        flag: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
