import type { CurrentUser } from "@/types/express";
import { Prisma } from "generated/prisma/client";
import AdminRepository from "./admin.repositoty";
import type { AdminQueries } from "./admin.validator";

export default class AdminService {
  adminRepository;
  constructor() {
    this.adminRepository = new AdminRepository();
  }

  async getAdmins(
    currentUser: CurrentUser,
    { page, limit, campusId, search, sortBy, sortOrder }: AdminQueries,
  ) {
    const skip = (page - 1) * limit;

    let filters: Prisma.AdminWhereInput = {};

    filters.campus = {
      some: {
        ...(currentUser.role === "admin" && {
          admin: {
            some: {
              userId: currentUser.userId,
            },
          },
        }),

        ...(currentUser.role === "warden" && {
          hostel: {
            some: {
              warden: {
                some: {
                  userId: currentUser.userId,
                },
              },
            },
          },
        }),
        ...(currentUser.role === "staff" && {
          hostel: {
            some: {
              staff: {
                some: {
                  userId: currentUser.userId,
                },
              },
            },
          },
        }),
        ...(currentUser.role === "tenant" && {
          hostel: {
            some: {
              tenant: {
                some: {
                  userId: currentUser.userId,
                },
              },
            },
          },
        }),
        ...(campusId && {
          id: campusId,
        }),
      },
    };

    if (currentUser.role === "superadmin" && !campusId) {
      filters = {};
    }

    if (search) {
      filters.user = {
        username: { contains: search, mode: "insensitive" },
      };
    }

    const campus = await this.adminRepository.getAdmins(
      filters,
      skip,
      limit,

    );
    return campus;
  }
}
