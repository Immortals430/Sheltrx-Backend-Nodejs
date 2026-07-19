import { prisma } from "@/config/prisma";
import type { Prisma } from "generated/prisma/browser";
import type {
  HostelType,
  OrganizationType,
  Role,
} from "generated/prisma/enums";

interface CreatePayload {
  hostelName: string;
  hostelCode: string;
  address: {
    line1: string;
    line2?: string | undefined;
    country: string;
    state: string;
    city: string;
    pinCode: string;
  };
  hostelType: HostelType;
  organizationType: OrganizationType;
  timeZone: string;
  totalFloors?: string | undefined;
  contactEmail?: string | undefined;
  contactPhone?: string | undefined;
}

interface UpdatePayload {
  hostelName?: string;
  address?: {
    line1: string | null;
    line2: string | null;
    country: string | null;
    state: string | null;
    city: string | null;
    pinCode: string | null;
  };
  hostelType?: HostelType;
  organizationType?: OrganizationType;
  timeZone?: string;
  totalFloors?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export default class HostelRepository {
  // get hostel
  async getHostels(
    filters: Prisma.HostelWhereInput,
    skip: number = 0,
    limit: number = 10,
    sortBy: "hostelName" | "createdAt" = "createdAt",
    sortOrder: "asc" | "desc" = "desc",
  ) {
    return prisma.hostel.findMany({
      where: filters,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });
  }

  // get hostel details
  async getHostelDetail(hostelId: number) {
    return prisma.hostel.findUnique({
      where: {
        id: hostelId,
      },
    });
  }

  // get hostel admin
  async getAdminHostel(hostelId: number, adminId: number) {
    return prisma.hostel.findUnique({
      where: {
        id: hostelId,
        campus: {
          admin: {
            some: {
              userId: adminId,
            },
          },
        },
      },
    });
  }

  // // get hostel staff
  // async getAdminStaff(hostelId: number, staffId: number) {
  //   return prisma.hostel.findUnique({
  //     where: {
  //       id: hostelId,
  //       staff: {
  //         some: {
  //           userId: staffId
  //         }
  //       }
  //     },
  //   });
  // }

  // get hostel warden
  // async getAdminWarden(hostelId: number, wardenId: number) {
  //   return prisma.hostel.findUnique({
  //     where: {
  //       id: hostelId,
  //       warden: {
  //         some: {
  //           userId: wardenId,
  //         },
  //       },
  //     },
  //   });
  // }

  // create hostel
  async createHostel(campusId: number, payload: CreatePayload) {
    return prisma.hostel.create({
      data: {
        campusId: campusId,
        hostelName: payload.hostelName,
        hostelCode: payload.hostelCode,
        address: payload.address,
        hostelType: payload.hostelType,
        organizationType: payload.organizationType,
        totalFloors: payload.totalFloors ?? null,
        contactEmail: payload.contactEmail ?? null,
        contactPhone: payload.contactPhone ?? null,
        timeZone: payload.timeZone,
      },
    });
  }

  // update hostel
  async updateHostel(hostelId: number, data: UpdatePayload) {
    return prisma.hostel.update({
      data,
      where: {
        id: hostelId,
      },
    });
  }

  // delete hostel
  async deleteHostel(hostelId: number) {
    return prisma.hostel.delete({
      where: {
        id: hostelId,
      },
    });
  }

  // assign warden to hostel
  async assignWarden(hostelId: number, userId: number) {
    return await prisma.hostel.update({
      where: {
        id: hostelId,
      },
      data: {
        warden: {
          connect: {
            userId: userId,
          },
        },
      },
    });
  }

  // unassign warden from hoste
  async removeWarden(hostelId: number, userId: number) {
    return await prisma.hostel.update({
      where: {
        id: hostelId,
      },
      data: {
        warden: {
          disconnect: {
            userId: userId,
          },
        },
      },
    });
  }

  // assign staff to hostel
  async assignStaff(hostelId: number, userId: number) {
    return await prisma.hostel.update({
      where: {
        id: hostelId,
      },
      data: {
        staff: {
          connect: {
            userId: userId,
          },
        },
      },
    });
  }
  // unassign staff to hostel
  async removeStaff(hostelId: number, userId: number) {
    return await prisma.hostel.update({
      where: {
        id: hostelId,
      },
      data: {
        staff: {
          disconnect: {
            userId: userId,
          },
        },
      },
    });
  }
}
