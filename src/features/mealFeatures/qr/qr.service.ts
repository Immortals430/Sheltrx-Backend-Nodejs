import QRCode from "qrcode";
import type { CurrentUser } from "@/types/express";
import type { CreateQr, GetQrs, ScanQr } from "./qr.validator";
import QrRepository from "./repositories/qrCode.repository";
import HostelRepository from "../../organizationFeatures/hostel/hostel.repository";
import { ApplicationError } from "@/middleware/errorHandler";
import UserService from "../../userFeatures/user/user.service";
import { randomBytes } from "node:crypto";
import type { Prisma } from "generated/prisma/client";
import MealScanLogRepository from "./repositories/mealScanLog.repository";
import {
  getLocalDate,
  getLocalTimeZone,
  HHMMSSToUTCISO,
  YYYYMMDDToUTCISO,
} from "@/lib/dateTime";
import MealTypeRepository from "../mealType/mealType.repository";
import TenantRepository from "@/features/userFeatures/tenant/tenant.repository";
import MealOptOutRepository from "../mealOptOut/mealOptOut.repository";
const SERVER_URL = process.env.SERVER_URL;

export default class QrService {
  qrRepository;
  hostelRepository;
  userService;
  mealScanLogRepository;
  mealTypeRepository;
  tenantRepository;
  mealOptOutRepository;
  constructor() {
    this.qrRepository = new QrRepository();
    this.hostelRepository = new HostelRepository();
    this.userService = new UserService();
    this.mealScanLogRepository = new MealScanLogRepository();
    this.mealTypeRepository = new MealTypeRepository();
    this.tenantRepository = new TenantRepository();
    this.mealOptOutRepository = new MealOptOutRepository();
  }

  async createQr({ hostelId }: CreateQr, currentUser: CurrentUser) {
    const hostel = await this.hostelRepository.getHostelDetail(hostelId);

    if (!hostel) {
      throw new ApplicationError("Hostel not found", 404);
    }

    if (currentUser.role === "admin") {
      await this.userService.validateHostelAccessForAdmin(
        hostelId,
        currentUser.userId,
      );
    }

    const qrToken = randomBytes(32).toString("base64url");

    const qrPayload = `${SERVER_URL}/scan?token=${qrToken}`;

    const qrUrl = await QRCode.toDataURL(qrPayload);

    await this.qrRepository.upsertQr({
      hostelId,
      qrToken,
      qrUrl,
    });

    return { qrUrl };
  }

  async getQrs(
    { campusId, limit = 10, page = 1 }: GetQrs,
    currentUser: CurrentUser,
  ) {
    const skip = (page - 1) * limit;

    const filters: Prisma.QrCodeWhereInput = {
      ...(campusId !== undefined &&
        (currentUser.role === "admin" || currentUser.role === "superadmin") && {
          hostel: {
            campus: {
              id: campusId,
            },
          },
        }),
    };

    const omit: Prisma.QrCodeOmit = {
      qrToken: true,
      createdAt: true,
      updatedAt: true,
    };

    const qrs = await this.qrRepository.getQrs({
      filters,
      omit,
      skip,
      limit,
    });

    return qrs;
  }

  async scanQr(payload: ScanQr, currentUser: CurrentUser) {
    const filters: Prisma.QrCodeWhereInput = {
      qrToken: payload.token,
    };
    const qr = await this.qrRepository.getQrDetail({ filters });

    if (!qr) {
      throw new ApplicationError("Invalid QR code", 400);
    }
    const hostel = await this.hostelRepository.getHostelDetail(qr.hostelId);

    if (!hostel) {
      throw new ApplicationError("Hostel no found", 400);
    }

    const clientCurrentTime = getLocalTimeZone(hostel.timeZone);
    const clientCurrentDate = getLocalDate(hostel.timeZone);

    const tenantFilter: Prisma.TenantWhereUniqueInput = {
      userId: currentUser.userId,
      joiningDate: {
        lte: YYYYMMDDToUTCISO(clientCurrentTime),
      },
      expectedExitDate: {
        gte: YYYYMMDDToUTCISO(clientCurrentTime),
      },
    };

    const tenant = await this.tenantRepository.getTenantDetail({
      filters: tenantFilter,
    });

    if (!tenant) {
      throw new ApplicationError("You are not eligible for meal", 400);
    }

    const mealFilters: Prisma.MealTypeWhereInput = {
      startTime: { lte: HHMMSSToUTCISO(clientCurrentTime) },
      endTime: { gte: HHMMSSToUTCISO(clientCurrentTime) },
      hostelId: hostel.id,
      mealPack: {
        some: {
          mealPreference: {
            some: {
              tenant: {
                userId: currentUser.userId,
                hostelId: hostel.id,
              },
            },
          },
        },
      },
      isActive: true,
    };

    const mealType = await this.mealTypeRepository.getMealTypeDetail({
      filters: mealFilters,
    });

    if (!mealType) {
      throw new ApplicationError("No meal at a time to scan", 400);
    }

    const mealOptOut = await this.mealOptOutRepository.getOptOutDetail(
      currentUser.userId,
      mealType.id,
      clientCurrentDate,
    );

    if (mealOptOut) {
      throw new ApplicationError("You have opted out of this meal", 400);
    }

    const scannedMealLog =
      await this.mealScanLogRepository.getMealScanLogDetail({
        filters: {
          tenantId: currentUser.userId,
          mealTypeId: mealType.id,
          scanDate: YYYYMMDDToUTCISO(clientCurrentDate),
        },
      });

    if(scannedMealLog){
      return {
        message: "You have already scanned this meal",
      }
    }

    const mealLog = await this.mealScanLogRepository.createMealScanLog({
      tenantId: currentUser.userId,
      hostelId: qr.hostelId,
      mealTypeId: mealType.id,
      scanDate: clientCurrentDate,
    });

    return mealLog;
  }
}
