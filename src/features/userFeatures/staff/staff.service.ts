import { ApplicationError } from "@/middleware/errorHandler.js";
import StaffRepository from "./staff.repository.js";
import type { CurrentUser } from "@/types/express.js";
import type { StaffQueries } from "./staff.validator.js";
import type { Prisma } from "generated/prisma/client.js";

export default class StaffService {
  staffRepository;
  constructor() {
    this.staffRepository = new StaffRepository();
  }

  async getStaff(
    currentUser: CurrentUser,
    { page, limit, hostelId, search }: StaffQueries,
  ) {
    const skip = (page - 1) * limit;

    let filters: Prisma.StaffWhereInput = {};

    filters.hostel = {
      some: {
        ...(currentUser.role === "admin" && {
          campus: {
            admin: {
              some: {
                userId: currentUser.userId,
              },
            },
          },
        }),

        ...(currentUser.role === "warden" && {
          warden: {
            some: {
              userId: currentUser.userId,
            },
          },
        }),
        ...(currentUser.role === "staff" && {
          staff: {
            some: {
              userId: currentUser.userId,
            },
          },
        }),
        ...(currentUser.role === "tenant" && {
          tenant: {
            some: {
              userId: currentUser.userId,
            },
          },
        }),
        ...(hostelId && {
          id: hostelId,
        }),
      },
    };

    if (currentUser.role === "superadmin" && !hostelId) {
      filters = {};
    }

    if (search) {
      filters.user = {
        username: { contains: search, mode: "insensitive" },
      };
    }

    const warden = await this.staffRepository.getStaff(filters, skip, limit);

    return warden;
  }
}
