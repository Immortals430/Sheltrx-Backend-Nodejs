import type { BedQueries, CreateBeds, UpdateBed } from "./bed.validator";
import type { Prisma } from "generated/prisma/client";
import BedRepository from "./bed.repository";
import { ApplicationError } from "@/middleware/errorHandler";
import { prisma } from "@/lib/prisma";
import type { CurrentUser } from "@/types/express";
import HostelRepository from "../hostel/hostel.repository";
import RoomRepository from "../room/room.repository";
import UserService from "../user/user.service";

export default class BedService {
  bedRepository;
  hostelRepository;
  roomRepository;
  userService
  constructor() {
    this.bedRepository = new BedRepository();
    this.hostelRepository = new HostelRepository();
    this.roomRepository = new RoomRepository();
    this.userService = new UserService()
  }

  async getBeds({ page, limit, roomId }: BedQueries, currentUser: CurrentUser) {
    const skip = (page - 1) * limit;

    const filters: Prisma.BedWhereInput = {
      ...(roomId && { roomId }),

      ...(currentUser.role === "admin" && {
        room: {
          hostel: {
            campus: {
              admin: {
                some: {
                  userId: currentUser.userId,
                },
              },
            },
          },
        },
      }),

      ...(currentUser.role === "warden" && {
        room: {
          hostel: {
            warden: {
              some: {
                userId: currentUser.userId,
              },
            },
          },
        },
      }),
    };

    return await this.bedRepository.getBeds(filters, skip, limit);
  }

  //   async getBedById(id: number) {
  //     const bed = await this.bedRepository.getBedById(id);
  //     if (!bed) throw new ApplicationError("Bed not found", 404);
  //     return bed;
  //   }

  async createBed(payload: CreateBeds, currentUser: CurrentUser) {
    const room = await this.roomRepository.getRoomDetails(payload.roomId);

    if (!room) throw new ApplicationError("Room not found", 404);

    if (currentUser.role === "admin") {
      await this.userService.validateHostelAccessForAdmin(
        room.hostelId,
        currentUser.userId,
      );
    }

    const beds = await this.bedRepository.createBed(payload);

    return beds;
  }

  async updateBed(bedId: number, payload: UpdateBed, currentUser: CurrentUser) {
    const bed = await this.bedRepository.getBedByDetails(bedId);

    if (!bed) {
      throw new ApplicationError("Bed not found", 404);
    }

    if (currentUser.role === "admin") {
      const bedAdmin = await this.bedRepository.getBedAdmin(
        bedId,
        currentUser.userId,
      );

      if (!bedAdmin) {
        throw new ApplicationError(
          "Cannot perform action for other hostel",
          404,
        );
      }
    }

    return await this.bedRepository.updateBed(bedId, {
      ...(payload.bedNumber !== undefined && {
        bedNumber: payload.bedNumber,
      }),

      // ...(payload.foodPlan !== undefined && {
      //   foodPlan: payload.foodPlan,
      // }),
    });
  }

  async deleteBed(bedId: number, currentUser: CurrentUser) {
    const bed = await this.bedRepository.getBedByDetails(bedId);

    if (!bed) {
      throw new ApplicationError("Bed not found", 404);
    }

    if (currentUser.role === "admin") {
      const bedAdmin = await this.bedRepository.getBedAdmin(
        bedId,
        currentUser.userId,
      );

      if (!bedAdmin) {
        throw new ApplicationError(
          "Cannot perform action for other hostel",
          404,
        );
      }
    }
    return await this.bedRepository.deleteBed(bedId);
  }
}
