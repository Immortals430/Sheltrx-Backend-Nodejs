import { ApplicationError } from "@/middleware/errorHandler.js";
import WardenRepository from "./warden.repository.js";
import type { CurrentUser } from "@/types/express.js";
import type { WardenQueries } from "./warden.validator.js";
import type { Prisma } from "generated/prisma/client.js";

export default class WardenService {
  wardenRepository;
  constructor() {
    this.wardenRepository = new WardenRepository();
  }

  async getWardens(
    currentUser: CurrentUser,
    { page, limit, hostelId, search }: WardenQueries,
  ) {
    const skip = (page - 1) * limit;

    let filters: Prisma.WardenWhereInput = {};

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

    const warden = await this.wardenRepository.getWardens(filters, skip, limit);

    return warden;
  }
}
