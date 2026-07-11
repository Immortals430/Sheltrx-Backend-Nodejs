import type { CurrentUser } from "@/types/express";
import type {
  CreateMenuPreset,
  MenuPresetQueries,
  // UpdateMenuPreset,
} from "./menuPreset.validator";
import { Prisma } from "generated/prisma/client";
import MenuPresetRepository from "./menuPreset.repository";
import HostelRepository from "../../hostel/hostel.repository";
import { ApplicationError } from "@/middleware/errorHandler";
import UserService from "../../user/user.service";

export default class MenuPresetService {
  menuPresetRepository;
  hostelRepository;
  userService;

  constructor() {
    this.menuPresetRepository = new MenuPresetRepository();
    this.hostelRepository = new HostelRepository();
    this.userService = new UserService();
  }

  async getMenuPresets(
    { page, limit, hostelId }: MenuPresetQueries,
    currentUser: CurrentUser,
  ) {
    const skip = (page - 1) * limit;

    let filters: Prisma.MenuPresetWhereInput = {
      ...(hostelId && { hostelId }),

      ...(currentUser.role === "admin" && {
        hostel: {
          campus: {
            admin: {
              some: {
                userId: currentUser.userId,
              },
            },
          },
        },
      }),
    };

    const menuPresets = await this.menuPresetRepository.getMenuPresets(
      filters,
      skip,
      limit,
    );

    return menuPresets;
  }

  async createMenuPreset(payload: CreateMenuPreset, currentUser: CurrentUser) {
    const hostel = await this.hostelRepository.getHostelDetail(payload.hostelId);

    if (!hostel) throw new ApplicationError("Hostel not found", 404);

    if (currentUser.role === "admin") {
      await this.userService.validateHostelAccessForAdmin(
        payload.hostelId,
        currentUser.userId,
      );
    }

    const menuPreset = await this.menuPresetRepository.createMenuPreset(payload);

    return menuPreset;
  }

  // async updateMenuPreset(
  //   menuPresetId: number,
  //   currentUser: CurrentUser,
  //   payload: UpdateMenuPreset,
  // ) {
  //   const menuPreset =
  //     await this.menuPresetRepository.getMenuPresetDetail(menuPresetId);

  //   if (!menuPreset) throw new ApplicationError("Menu preset not found", 404);

  //   if (currentUser.role === "admin") {
  //     await this.userService.validateHostelAccessForAdmin(
  //       menuPreset.hostelId,
  //       currentUser.userId,
  //     );
  //   }

  //   const updatedMenuPreset = await this.menuPresetRepository.updateMenuPreset(
  //     menuPresetId,
  //     {
  //       ...(payload.menuPresetName !== undefined && {
  //         menuPresetName: payload.menuPresetName,
  //       }),
  //       ...(payload.menuPresetItem !== undefined && {
  //         menuPresetItem: payload.menuPresetItem,
  //       }),
  //     },
  //   );

  //   return updatedMenuPreset;
  // }

  async deleteMenuPreset(menuPresetId: number, currentUser: CurrentUser) {
    const menuPreset =
      await this.menuPresetRepository.getMenuPresetDetail(menuPresetId);

    if (!menuPreset) throw new ApplicationError("Menu preset not found", 404);

    if (currentUser.role === "admin") {
      await this.userService.validateHostelAccessForAdmin(
        menuPreset.hostelId,
        currentUser.userId,
      );
    }

    const deletedMenuPreset =
      await this.menuPresetRepository.deleteMenuPreset(menuPresetId);

    return deletedMenuPreset;
  }
}
