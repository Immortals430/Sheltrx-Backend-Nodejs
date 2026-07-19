import type { CurrentUser } from "@/types/express";
import type { CreateRoom, RoomQueries, UpdateRoom } from "./room.validator";
import { FoodPlan, type Prisma } from "generated/prisma/client";
import RoomRepository from "./room.repository";
import HostelRepository from "../hostel/hostel.repository";
import { ApplicationError } from "@/middleware/errorHandler";
import RoomTypeRepository from "../roomType/roomType.repository";
import { prisma } from "@/config/prisma";
import BedRepository from "../bed/bed.repository";
import UserService from "../../userFeatures/user/user.service";

export default class RoomService {
  roomRepository;
  hostelRepository;
  roomTypeRepository;
  bedRepository;
  userService;
  constructor() {
    this.roomRepository = new RoomRepository();
    this.hostelRepository = new HostelRepository();
    this.roomTypeRepository = new RoomTypeRepository();
    this.bedRepository = new BedRepository();
    this.userService = new UserService();
  }

  async getRooms(
    currentUser: CurrentUser,
    { page, limit, hostelId, availability, roomTypeName }: RoomQueries,
  ) {
    const skip = (page - 1) * limit;

    let filters: Prisma.RoomWhereInput = {};

    filters = {
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

      ...(currentUser.role === "warden" && {
        hostel: {
          warden: {
            some: {
              userId: currentUser.userId,
            },
          },
        },
      }),

      ...(hostelId && { hostelId }),

      ...(roomTypeName && { roomType: { roomTypeName } }),

      ...(availability === "vacant" && {
        bed: {
          some: {
            tenantId: null,
          },
        },
      }),

      ...(availability === "occupied" && {
        bed: {
          every: {
            tenantId: { not: null },
          },
        },
      }),
    };

    const rooms = await this.roomRepository.getRooms(filters, skip, limit);

    return rooms;
  }

  async createRoom(payload: CreateRoom) {
    const hostel = await this.hostelRepository.getHostelDetail(
      payload.hostelId,
    );

    if (!hostel) throw new ApplicationError("Hostel not found", 404);

    const roomType = await this.roomTypeRepository.getRoomTypeDetail(
      payload.roomTypeId,
    );

    if (!roomType) throw new ApplicationError("Room type not found", 404);

    let room;

    await prisma.$transaction(async (tx) => {
      room = await this.roomRepository.createRoom(payload, tx);

      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const bedsPayload = [];

      for (let i = 0; i < roomType.totalBeds; i++) {
        const bedNumber =
          i < letters.length
            ? `${payload.roomNumber}${letters[i]}`
            : `${payload.roomNumber}-${i + 1}`;

        bedsPayload.push({
          roomId: room.id,
          bedNumber: bedNumber,
          foodPlan: FoodPlan.veg,
        });
      }

      await this.bedRepository.createBeds(bedsPayload, tx);
    });

    return room;
  }

  async deleteRoom(roomId: number, currentUser: CurrentUser) {
    const room = await this.roomRepository.getRoomDetails(roomId);

    if (!room) throw new ApplicationError("Room not found", 404);

    if (currentUser.role === "admin") {
      await this.userService.validateHostelAccessForAdmin(
        room.hostelId,
        currentUser.userId,
      );
    }

    const deletedRoom = await this.roomRepository.deleteRoom(roomId);

    return deletedRoom;
  }

  async updateRoom(
    roomId: number,
    currentUser: CurrentUser,
    payload: UpdateRoom,
  ) {
    const room = await this.roomRepository.getRoomDetails(roomId);

    if (!room) {
      throw new ApplicationError("Room not found", 404);
    }

    if (currentUser.role === "admin") {
      await this.userService.validateHostelAccessForAdmin(
        room.hostelId,
        currentUser.userId,
      );
    }

    const updatedRoom = await this.roomRepository.updateRoom(roomId, {
      ...(payload.roomNumber !== undefined && {
        roomNumber: payload.roomNumber,
      }),
      ...(payload.floor !== undefined && {
        floor: payload.floor,
      }),
    });

    return updatedRoom;
  }
}
