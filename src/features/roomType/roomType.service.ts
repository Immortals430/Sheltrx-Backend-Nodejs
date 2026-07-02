import type { CurrentUser } from "@/types/express";
import type {
  CreateRoomType,
  RoomTypeQueries,
  UpdatePayload,
} from "./roomType.validator";
import { Prisma } from "generated/prisma/client";
import RoomTypeRepository from "./roomType.repository";
import HostelRepository from "../hostel/hostel.repository";
import { ApplicationError } from "@/middleware/errorHandler";
import AdminRepository from "../admin/admin.repositoty";

export default class RoomTypeService {
  roomTypeRepository;
  hostelRepository;
  adminRpository;
  constructor() {
    this.roomTypeRepository = new RoomTypeRepository();
    this.hostelRepository = new HostelRepository();
    this.adminRpository = new AdminRepository();
  }

  async getRoomTypes(
    currentUser: CurrentUser,
    { page, limit, hostelId, roomTypeName }: RoomTypeQueries,
  ) {
    const skip = (page - 1) * limit;

    let filters: Prisma.RoomTypeWhereInput = {};

    filters = {
      ...(hostelId && { hostelId }),
      ...(roomTypeName && {
        roomTypeName: { startsWith: roomTypeName, mode: "insensitive" },
      }),
    };

    const roomTypes = await this.roomTypeRepository.getRoomTypes(
      filters,
      skip,
      limit,
    );

    return roomTypes;
  }

  async createRoomType(payload: CreateRoomType) {
    const hostel = await this.hostelRepository.getHostelDetail(
      payload.hostelId,
    );

    if (!hostel) throw new ApplicationError("Hostel not found", 404);

    const roomType = await this.roomTypeRepository.createRoomType(payload);

    return roomType;
  }

  // delete room type
  async deleteRoomType(roomTypeId: number, currentUser: CurrentUser) {
    const roomType =
      await this.roomTypeRepository.getRoomTypeDetail(roomTypeId);

    if (!roomType) throw new ApplicationError("Room type not found", 404);

    if (currentUser.role === "admin") {
      const hostel = await this.hostelRepository.getAdminHostel(
        roomType.hostelId,
        currentUser.userId,
      );

      if (!hostel)
        throw new ApplicationError(
          "Cannot perform action for other hostel",
          404,
        );
    }

    const deletedRoomType =
      await this.roomTypeRepository.deleteRoomType(roomTypeId);

    return deletedRoomType;
  }

  // update room type
  async updateRoomType(
    roomTypeId: number,
    currentUser: CurrentUser,
    payload: UpdatePayload,
  ) {
    const roomType =
      await this.roomTypeRepository.getRoomTypeDetail(roomTypeId);

    if (!roomType) throw new ApplicationError("Room type not found", 404);

    if (currentUser.role === "admin") {
      const hostel = await this.hostelRepository.getAdminHostel(
        roomType.hostelId,
        currentUser.userId,
      );

      if (!hostel)
        throw new ApplicationError(
          "Cannot perform action for other hostel",
          404,
        );
    }

    const updatedRoomType = await this.roomTypeRepository.updateRoomType(
      roomTypeId,
      {
        ...(payload.roomTypeName !== undefined && {
          roomTypeName: payload.roomTypeName,
        }),
        ...(payload.priceWithFood !== undefined && {
          priceWithFood: payload.priceWithFood,
        }),
        ...(payload.priceWithoutFood !== undefined && {
          priceWithoutFood: payload.priceWithoutFood,
        }),
        ...(payload.totalBeds !== undefined && {
          totalBeds: payload.totalBeds,
        }),
        ...(payload.isAc !== undefined && {
          isAc: payload.isAc,
        }),
        ...(payload.comment !== undefined && {
          comment: payload.comment,
        }),
      },
    );

    return updatedRoomType;
  }
}
