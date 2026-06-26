import CampusRepository from "./campus.repository";
import type {
  CreateCampus,
  CampusQueries,
  UpdateCampus,
  AssignAdmin,
} from "./campus.validatior";
import { shortSlug, timeSuffix } from "@/utility/misc";
import InstitutionRepository from "../instittution/institution.repository";
import { ApplicationError } from "@/middleware/errorHandler";
import type { Prisma } from "generated/prisma/browser";
import type { CurrentUser } from "@/types/express";
import { superAdmin } from "../auth/auth.validator";
import AdminRepository from "../admin/admin.repositoty";
import UserRepository from "../user/user.repository";

export default class CampusService {
  campusRepository;
  institutionRepository;
  adminRepository;
  userRepository;
  constructor() {
    this.campusRepository = new CampusRepository();
    this.institutionRepository = new InstitutionRepository();
    this.adminRepository = new AdminRepository();
    this.userRepository = new UserRepository();
  }
  async createCampus(payload: CreateCampus) {
    const institution = await this.institutionRepository.getInstitutionDetail(
      payload.institutionId,
    );
    if (!institution) throw new ApplicationError("Institution not found", 404);

    let campusCode =
      shortSlug(institution.institutionName) +
      shortSlug(payload.address.city) +
      shortSlug(payload.campusName) +
      "-" +
      timeSuffix();

    const campus = await this.campusRepository.createCampus(
      institution.id,
      campusCode,
      {
        campusName: payload.campusName,
        address: payload.address,
        contactPerson: payload.contactPerson,
        contactEmail: payload.contactEmail,
        contactPhone: payload.contactPhone,
        country: payload.address.country,
        state: payload.address.state,
        city: payload.address.city,
      },
    );

    return campus;
  }

  async getCampus(
    currentUser: CurrentUser,
    {
      page = "1",
      limit = "10",
      institutinId,
      search,
      country,
      city,
      state,
      sortBy,
      sortOrder,
    }: CampusQueries,
  ) {
    const skip = (Number(page) - 1) * Number(limit);

    const filters: Prisma.CampusWhereInput = {};

    // role based filtering
    if (currentUser.role === "admin") {
      filters.admin = {
        some: {
          userId: currentUser.userId,
        },
      };
    } else if (currentUser.role === "warden") {
      filters.hostel = {
        some: {
          warden: {
            some: {
              userId: currentUser.userId,
            },
          },
        },
      };
    } else if (currentUser.role === "staff") {
      filters.hostel = {
        some: {
          staff: {
            some: {
              userId: currentUser.userId,
            },
          },
        },
      };
    } else if (currentUser.role === "tenant") {
      filters.hostel = {
        some: {
          tenant: {
            some: {
              userId: currentUser.userId,
            },
          },
        },
      };
    }

    // common filters
    if (institutinId) {
      filters.institutionId = Number(institutinId);
    }

    if (search) {
      filters.campusName = { startsWith: search, mode: "insensitive" };
    }

    if (country) {
      filters.country = country;
    }

    if (state) {
      filters.state = state;
    }

    if (city) {
      filters.city = city;
    }

    const campus = await this.campusRepository.getCampus(
      filters,
      skip,
      Number(limit),
      sortBy,
      sortOrder,
    );
    return campus;
  }

  async getCampusDetail(params: string) {
    const campus = await this.campusRepository.getCampusDetail(Number(params));
    return campus;
  }

  async updateCampus(campusId: string, payload: UpdateCampus) {
    const campusDetail = await this.campusRepository.getCampusDetail(
      Number(campusId),
    );

    let newAddress = { ...JSON.parse(JSON.stringify(campusDetail?.address)) };

    const campus = await this.campusRepository.updateCampus(Number(campusId), {
      ...(payload.campusName !== undefined && {
        campusName: payload.campusName,
      }),
      ...(payload.contactPerson !== undefined && {
        contactPhone: payload.contactPerson,
      }),
      ...(payload.contactEmail !== undefined && {
        contactEmail: payload.contactEmail,
      }),
      ...(payload.contactPhone !== undefined && {
        contactPhone: payload.contactPhone,
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
      ...(payload.address?.country !== undefined && {
        country: payload.address.country,
      }),
      ...(payload.address?.city !== undefined && {
        city: payload.address.city,
      }),
      ...(payload.address?.state !== undefined && {
        state: payload.address.state,
      }),
    });
    return campus;
  }

  async deleteCampus(params: string) {
    const campus = await this.campusRepository.deleteCampus(Number(params));
    return campus;
  }

  // assign admin
  async assignAdmin(
    campusId: string,
    adminId: string,
    currentUser: CurrentUser,
  ) {
    const campusDetail = await this.campusRepository.getCampusDetail(
      Number(campusId),
    );
    if (!campusDetail) throw new ApplicationError("Campus not found", 404);

    const userDetail = await this.userRepository.getUserDetail(Number(adminId));

    if (!userDetail) {
      throw new ApplicationError("User not found", 404);
    }

    if (userDetail.role !== "admin") {
      throw new ApplicationError(
        `${userDetail.role} cant be assigned to campus`,
        400,
      );
    }

    const campus = await this.campusRepository.assignAdmin(
      Number(campusId),
      Number(adminId),
    );
    return campus;
  }

  // remove admin
  async removeAdmin(
    campusId: string,
    adminId: string,
    currentUser: CurrentUser,
  ) {
    const campusDetail = await this.campusRepository.getCampusDetail(
      Number(campusId),
    );

    if (!campusDetail) throw new ApplicationError("Campus not found", 404);

    const userDetail = await this.userRepository.getUserDetail(Number(adminId));

    if (!userDetail) {
      throw new ApplicationError("User not found", 404);
    }

    if (userDetail.role !== "admin") {
      throw new ApplicationError(
        `${userDetail.role} cant be assigned to campus`,
        400,
      );
    }

    const campus = await this.campusRepository.removeAdmin(
      Number(campusId),
      Number(adminId),
    );
    return campus;
  }
}
