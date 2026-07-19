import { prisma } from "@/config/prisma";
import type { Prisma } from "generated/prisma/client";

interface CreatePayload {
  hostelId: number;
  menuPresetName: string;
  menuPresetItem: {
    veg: string[];
    nonVeg: string[];
  };
}

// interface UpdatePayload {
//   menuPresetName?: string;
//   menuPresetItem?: string[];
// }

export default class MenuPresetRepository {
  // get menu presets
  async getMenuPresets(
    filters: Prisma.MenuPresetWhereInput,
    skip: number = 0,
    limit: number = 10,
    sortBy: "createdAt" = "createdAt",
    sortOrder: "asc" | "desc" = "desc",
  ) {
    return await prisma.menuPreset.findMany({
      where: filters,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });
  }

  // get menu preset detail
  async getMenuPresetDetail(menuPresetId: number) {
    return await prisma.menuPreset.findUnique({
      where: { id: menuPresetId },
    });
  }

  // create menu preset
  async createMenuPreset(payload: CreatePayload) {
    return await prisma.menuPreset.create({
      data: {
        hostelId: payload.hostelId,
        menuPresetName: payload.menuPresetName,
        menuPresetItem: payload.menuPresetItem,
      },
    });
  }

  // update menu preset
  // async updateMenuPreset(menuPresetId: number, data: UpdatePayload) {
  //   return await prisma.menuPreset.update({
  //     where: { id: menuPresetId },
  //     data,
  //   });
  // }

  // delete menu preset
  async deleteMenuPreset(menuPresetId: number) {
    return await prisma.menuPreset.delete({
      where: { id: menuPresetId },
    });
  }
}
