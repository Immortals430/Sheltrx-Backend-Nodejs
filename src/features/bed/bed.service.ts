// import type { CreateBeds, UpdateBed, BedQueries } from "./bed.validator";
// import type { Prisma } from "generated/prisma/client";
// import BedRepository from "./bed.repository";
// import { ApplicationError } from "@/middleware/errorHandler";
// import { prisma } from "@/lib/prisma";

// export default class BedService {
//   bedRepository;

//   constructor() {
//     this.bedRepository = new BedRepository();
//   }

//   async getBeds({ page, limit, roomId, foodPlan, availability }: BedQueries) {
//     const skip = (page - 1) * limit;

//     const filters: Prisma.BedWhereInput = {
//       ...(roomId && { roomId }),

//       ...(foodPlan && { foodPlan }),

//       ...(availability === "vacant" && { tenantId: null }),

//       ...(availability === "occupied" && { tenantId: { not: null } }),
//     };

//     return await this.bedRepository.getBeds(filters, skip, limit);
//   }

//   async getBedById(id: number) {
//     const bed = await this.bedRepository.getBedById(id);
//     if (!bed) throw new ApplicationError("Bed not found", 404);
//     return bed;
//   }

//   async createBeds(payload: CreateBeds) {
//     // Verify the room exists
//     const room = await prisma.room.findUnique({
//       where: { id: payload.roomId },
//       include: { roomType: true },
//     });

//     if (!room) throw new ApplicationError("Room not found", 404);

//     // Check for duplicate bed numbers within the request
//     const bedNumbers = payload.beds.map((b) => b.bedNumber);
//     const uniqueBedNumbers = new Set(bedNumbers);
//     if (uniqueBedNumbers.size !== bedNumbers.length) {
//       throw new ApplicationError(
//         "Duplicate bed numbers found in the request",
//         400,
//       );
//     }

//     // Check for bed number conflicts in the DB
//     const existingBeds = await prisma.bed.findMany({
//       where: {
//         roomId: payload.roomId,
//         bedNumber: { in: bedNumbers },
//       },
//     });

//     if (existingBeds.length > 0) {
//       const conflicting = existingBeds.map((b) => b.bedNumber).join(", ");
//       throw new ApplicationError(
//         `Bed numbers already exist in this room: ${conflicting}`,
//         409,
//       );
//     }

//     // Bulk create inside a transaction
//     const createdBeds = await prisma.$transaction(async (tx) => {
//       return await this.bedRepository.createBeds(payload, tx);
//     });

//     return createdBeds;
//   }

//   async updateBed(id: number, payload: UpdateBed) {
//     await this.getBedById(id); // ensure bed exists
//     return await this.bedRepository.updateBed(id, payload);
//   }

//   async deleteBed(id: number) {
//     await this.getBedById(id); // ensure bed exists
//     return await this.bedRepository.deleteBed(id);
//   }
// }
