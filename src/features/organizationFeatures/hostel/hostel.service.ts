import type { Role } from "generated/prisma/enums";
import HostelRepository from "./hostel.repository";
import type {
  CreateHostel,
  HostelQueries,
  UpdateHostel,
} from "./hostel.validatior";
import CampusRepository from "../campus/campus.repository";
import { ApplicationError } from "@/middleware/errorHandler";
import { shortSlug, timeSuffix } from "@/utility/misc";
import type { Prisma } from "generated/prisma/browser";
import type { CurrentUser } from "@/types/express";
import UserRepository from "../../userFeatures/user/user.repository";
import WardenRepository from "../../userFeatures/warden/warden.repository";

export default class HostelService {
  hostelRepository;
  campusRepository;
  userRepository;
  wardenRepository;
  constructor() {
    this.hostelRepository = new HostelRepository();
    this.campusRepository = new CampusRepository();
    this.userRepository = new UserRepository();
    this.wardenRepository = new WardenRepository();
  }

  async getHostels(
    currentUser: CurrentUser,
    {
      page = "1",
      limit = "10",
      campusId,
      search,
      // sortBy,
      // sortOrder,
    }: HostelQueries,
  ) {
    const skip = (Number(page) - 1) * Number(limit);

    const filters: Prisma.HostelWhereInput = {};

    // role based filtering
    if (currentUser.role === "admin") {
      filters.campus = {
        admin: {
          some: {
            userId: currentUser.userId,
          },
        },
      };
    } else if (currentUser.role === "warden") {
      filters.warden = {
        some: {
          userId: currentUser.userId,
        },
      };
    } else if (currentUser.role === "staff") {
      filters.staff = {
        some: {
          userId: currentUser.userId,
        },
      };
    } else if (currentUser.role === "tenant") {
      filters.tenant = {
        some: {
          userId: currentUser.userId,
        },
      };
    }

    // common filters
    if (campusId) {
      filters.campusId = Number(campusId);
    }

    if (search) {
      filters.hostelName = { startsWith: search, mode: "insensitive" };
    }

    const hostels = await this.hostelRepository.getHostels(
      filters,
      skip,
      Number(limit),
      // sortBy,
      // sortOrder,
    );

    return hostels;
  }

  async getHostelDetail(hostelId: string) {
    const hostel = await this.hostelRepository.getHostelDetail(
      Number(hostelId),
    );

    return hostel;
  }

  async createHostel(payload: CreateHostel) {
    const campus = await this.campusRepository.getCampusDetail(
      payload.campusId,
    );

    if (!campus) throw new ApplicationError("Campus not found", 404);

    let hostelCode =
      shortSlug(campus.campusName) +
      shortSlug(payload.address.city) +
      shortSlug(payload.hostelName) +
      "-" +
      timeSuffix();

    const hostel = await this.hostelRepository.createHostel(campus.id, {
      hostelName: payload.hostelName,
      hostelCode,
      address: payload.address,
      hostelType: payload.hostelType,
      organizationType: payload.organizationType,
      contactEmail: payload.contactEmail,
      contactPhone: payload.contactPhone,
      totalFloors: payload.totalFloors,
    });
    return hostel;
  }

  async updateHostel(hostelId: string, payload: UpdateHostel) {
    const hostelDetail = await this.hostelRepository.getHostelDetail(
      Number(hostelId),
    );
    let newAddress = { ...JSON.parse(JSON.stringify(hostelDetail?.address)) };

    const hostel = await this.hostelRepository.updateHostel(Number(hostelId), {
      ...(payload.hostelName !== undefined && {
        hostelName: payload.hostelName,
      }),
      ...(payload.address !== undefined && {
        address: {
          line1: payload.address.line1 || newAddress?.line1 || null,
          line2: payload.address.line2 || newAddress?.line2 || null,
          city: payload.address.city || newAddress?.city || null,
          state: payload.address.state || newAddress?.state || null,
          country: payload.address.country || newAddress?.country || null,
          pinCode: payload.address.pinCode || newAddress?.pinCode || null,
        },
      }),

      ...(payload.hostelType !== undefined && {
        hostelType: payload.hostelType,
      }),

      ...(payload.organizationType !== undefined && {
        organizationType: payload.organizationType,
      }),

      ...(payload.contactEmail !== undefined && {
        contactEmail: payload.contactEmail,
      }),

      ...(payload.contactPhone !== undefined && {
        contactPhone: payload.contactPhone,
      }),

      ...(payload.totalFloors !== undefined && {
        totalFloors: payload.totalFloors,
      }),
    });
    return hostel;
  }

  async deleteHostel(hostelId: string) {
    const hostel = await this.hostelRepository.deleteHostel(Number(hostelId));

    return hostel;
  }

  // assign warden to hostel
  async assignWarden(
    hostelId: string,
    wardenId: string,
    currentUser: CurrentUser,
  ) {
    const hostelDetail = await this.hostelRepository.getHostelDetail(
      Number(hostelId),
    );

    if (!hostelDetail) throw new ApplicationError("Hostel not found", 404);

    const userDetail = await this.userRepository.getUserDetail(
      Number(wardenId),
    );

    if (!userDetail) {
      throw new ApplicationError("User not found", 404);
    }

    if (userDetail.role !== "warden") {
      throw new ApplicationError(
        `${userDetail.role} cant be assigned to hostel as warden`,
        400,
      );
    }

    const hostel = await this.hostelRepository.assignWarden(
      Number(hostelId),
      Number(wardenId),
    );

    return hostel;
  }

  // remove admin
  async removeWarden(
    hostelId: string,
    wardenId: string,
    currentUser: CurrentUser,
  ) {
    const hostelDetail = await this.hostelRepository.getHostelDetail(
      Number(hostelId),
    );

    if (!hostelDetail) throw new ApplicationError("Hostel not found", 404);

    const userDetail = await this.userRepository.getUserDetail(
      Number(wardenId),
    );

    if (!userDetail) {
      throw new ApplicationError("User not found", 404);
    }

    if (userDetail.role !== "warden") {
      throw new ApplicationError(
        `${userDetail.role} cant be assigned to hostel as warden`,
        400,
      );
    }

    const hostel = await this.hostelRepository.removeWarden(
      Number(hostelId),
      Number(wardenId),
    );

    return hostel;
  }

  // assign warden to hostel
  async assignStaff(
    hostelId: string,
    staffId: string,
    currentUser: CurrentUser,
  ) {
    const hostelDetail = await this.hostelRepository.getHostelDetail(
      Number(hostelId),
    );

    if (!hostelDetail) throw new ApplicationError("Hostel not found", 404);

    const userDetail = await this.userRepository.getUserDetail(Number(staffId));

    if (!userDetail) {
      throw new ApplicationError("User not found", 404);
    }

    if (userDetail.role !== "staff") {
      throw new ApplicationError(
        `${userDetail.role} cant be assigned to hostel as staff`,
        400,
      );
    }

    const hostel = await this.hostelRepository.assignStaff(
      Number(hostelId),
      Number(staffId),
    );

    return hostel;
  }

  // remove admin
  async removeStaff(
    hostelId: string,
    staffId: string,
    currentUser: CurrentUser,
  ) {
    const hostelDetail = await this.hostelRepository.getHostelDetail(
      Number(hostelId),
    );

    if (!hostelDetail) throw new ApplicationError("Hostel not found", 404);

    const userDetail = await this.userRepository.getUserDetail(Number(staffId));

    if (!userDetail) {
      throw new ApplicationError("User not found", 404);
    }

    if (userDetail.role !== "staff") {
      throw new ApplicationError(
        `${userDetail.role} cant be assigned to hostel as staff`,
        400,
      );
    }

    const hostel = await this.hostelRepository.removeStaff(
      Number(hostelId),
      Number(staffId),
    );

    return hostel;
  }
}
