import type { Login, Signup, SuperAdmin } from "./auth.validator.js";
import UserRepository from "../user/user.repository.js";
import { ApplicationError } from "@/middleware/errorHandler.js";
import { comparePassword, hashPassword } from "@/utility/bcrypt.js";
import AuthCacheRepository from "./auth.cache.repository.js";
import { prisma } from "@/lib/prisma.js";
import AdminRepository from "../admin/admin.repositoty.js";
import { isEmail } from "@/utility/emailValidator.js";
import SuperAdminRepository from "../superadmin/superadmin.repositoty.js";
// import type { CreateUser } from "../user/user.validator.js";
// import type { CreateAdmin } from "../admin/admin.validator.js";
import AadhaarRepository from "../aadhaar/aadhaar.repository.js";
import WardenRepository from "../warden/warden.repository.js";
import StaffRepository from "../staff/staff.repository.js";
import TenantRepository from "../tenant/tenant.repository.js";
const isProduction = process.env.NODE_ENV === "production";
const SUPERADMIN_SECRET = process.env.SUPERADMIN_SECRET || "xyz";

export default class AuthService {
  userRepository;
  adminRepository;
  authCache;
  superAdminRepository;
  aadhaarRepository;
  wardenRepository;
  staffRepository;
  tenantRepository;
  constructor() {
    this.userRepository = new UserRepository();
    this.adminRepository = new AdminRepository();
    this.authCache = new AuthCacheRepository();
    this.superAdminRepository = new SuperAdminRepository();
    this.aadhaarRepository = new AadhaarRepository();
    this.wardenRepository = new WardenRepository();
    this.staffRepository = new StaffRepository();
    this.tenantRepository = new TenantRepository();
  }

  async createSuperAdmin(payload: SuperAdmin, secret: string) {
    if (secret !== SUPERADMIN_SECRET) {
      throw new ApplicationError("Superadmin secret is invalid", 401);
    }

    const existingUser = await this.userRepository.findUserByPhone(
      payload.phoneNumber,
    );

    if (existingUser) {
      throw new ApplicationError("Superadmin already exists", 409);
    }

    let user;

    await prisma.$transaction(async (tx) => {
      user = await this.userRepository.createUser(
        { ...payload, role: "superadmin" },
        tx,
      );

      await this.superAdminRepository.createSuperAdmin(user.id, tx);
    });

    return user;
  }

  async login({ identifier, otp }: Login) {
    let user;

    if (isEmail(identifier)) {
      user = await this.userRepository.findUserByEmail(identifier);
    } else {
      user = await this.userRepository.findUserByPhone(identifier);
    }

    if (!user) {
      throw new ApplicationError("User not found", 404);
    }

    if (!otp) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await this.authCache.createCacheLoginOtp({ identifier, otp });
      return { message: "Otp Sent Successfully" };
    }

    const savedOtp = await this.authCache.getCacheLoginOtp(identifier);

    if (!savedOtp || savedOtp !== otp) {
      throw new ApplicationError("Invalid or expired OTP", 400);
    }

    // if user already logged in
    const oldSessionId = await this.authCache.getCacheAuthUser(String(user.id));

    if (oldSessionId) {
      await this.authCache.deleteCacheCookie(oldSessionId);
    }

    await this.authCache.deleteCacheLoginOtp(identifier);

    return { user, message: "Login Successful" };
  }

  async saveAuthUserSession(userId: string, newSessionId: string) {
    await this.authCache.createCacheAuthUser(userId, newSessionId);
  }

  async clearAuthUserSession(userId: string) {
    const sessionId = await this.authCache.getCacheAuthUser(userId);
    if (sessionId) {
      await this.authCache.deleteCacheCookie(sessionId);
    }
    await this.authCache.deleteCacheAuthUser(userId);
  }

  // signup
  async signup(payload: Signup) {
    const existingUser = await this.userRepository.findUserByEmail(
      payload.email,
    );

    if (existingUser) {
      throw new ApplicationError("User already exists", 409);
    }

    await prisma.$transaction(async (tx) => {
      const user = await this.userRepository.createUser(payload, tx);

      let userDetail;

      const aadhaarDetail = await this.aadhaarRepository.createAadhaar(
        payload.aadhaarNumber,
        tx,
      );

      if (payload.role === "admin" && user) {
        userDetail = await this.adminRepository.createAdmin(
          user.id,
          aadhaarDetail.id,
          {
            billingAddress: payload.billingAddress,
            subscriptionPlan: payload.subscriptionPlan,
            profilePhoto: payload.profilePhoto,
          },
          tx,
        );
      }

      if (payload.role === "warden" && user) {
        userDetail = await this.wardenRepository.createWarden(
          user.id,
          aadhaarDetail.id,
          {
            gender: payload.gender,
            dob: payload.dob,
            profilePhoto: payload.profilePhoto,
            alternateNumber: payload.alternateNumber,
            address: payload.address,
            comment: payload.comment,
          },
          tx,
        );
      }

      if (payload.role === "staff" && user) {
        userDetail = await this.staffRepository.createStaff(
          user.id,
          aadhaarDetail.id,
          {
            gender: payload.gender,
            dob: payload.dob,
            profilePhoto: payload.profilePhoto,
            alternateNumber: payload.alternateNumber,
            address: payload.address,
            comment: payload.comment,
            roleType: payload.roleType,
          },
          tx,
        );
      }

      if (payload.role === "tenant" && user) {
        userDetail = await this.tenantRepository.createTenant(
          user.id,
          aadhaarDetail.id,
          {
            gender: payload.gender,
            dob: payload.dob,
            profilePhoto: payload.profilePhoto,
            address: payload.address,
            comment: payload.comment,
            joiningDate: payload.joiningDate,
            expectedExitDate: payload.expectedExitDate,
            localGuardianName: payload.localGuardianName,
            localGuardianPhone: payload.localGuardianPhone,
            localGuardianRelation: payload.localGuardianRelation,
          },
          tx,
        );
      }

      return user;
    });
  }
}
