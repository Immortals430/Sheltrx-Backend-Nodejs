import {
  AdminSubscriptionPlan,
  Gender,
  Role,
  StaffRoleType,
  SuperAdminAccessScope,
  SuperAdminRoleType,
} from "generated/prisma/enums";
import { z } from "zod";

export const login = z.object({
  identifier: z.string().trim().nonempty("Email or Phone number required"),
  otp: z
    .string()
    .regex(/^\d{6}$/, "OTP must be 6 digits")
    .optional(),
});

export const signup = z
  .object({
    //user
    username: z.string().trim().nonempty("Full name is required"),
    email: z
      .string()
      .trim()
      .nonempty("Email is required")
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
    phoneNumber: z.string().nonempty("Phone number is required"),
    role: z.enum(Role),
    // common
    profilePhoto: z.string().optional(),
    aadhaarNumber: z
      .string()
      .trim()
      .length(12, "Aadhaar must be 12 digits")
      .regex(/^[0-9]+$/, "Aadhaar must contain only numbers")
      .optional(),
    billingAddress: z.string().trim().optional(),
    alternateNumber: z.string().optional(),
    comment: z.string().optional(),
    address: z
      .object({
        line1: z.string(),
        line2: z.string().optional(),
        city: z.string(),
        state: z.string(),
        country: z.string(),
        pinCode: z.string(),
      })
      .optional(),
    gender: z.enum(Gender),
    dob: z.iso.date().optional(),

    // admin
    subscriptionPlan: z.enum(AdminSubscriptionPlan),

    // staff
    roleType: z.enum(StaffRoleType).optional(),

    // tenant
    localGuardianName: z.string().trim().optional(),
    localGuardianPhone: z.string().trim().optional(),
    localGuardianRelation: z.string().trim().optional(),
    joiningDate: z.iso.date().optional(),
    expectedExitDate: z.iso.date().optional(),
  })
  .superRefine((data, ctx) => {
  if (data.role === Role.staff && !data.roleType) {
    ctx.addIssue({
      code: "custom",
      path: ["roleType"],
      message: "roleType is required",
    });
  }

  if (data.role === Role.tenant) {
    // if (!data.joiningDate) {
    //   ctx.addIssue({
    //     code: "custom",
    //     path: ["joiningDate"],
    //     message: "Joining date is required",
    //   });
    // }

    // if (!data.expectedExitDate) {
    //   ctx.addIssue({
    //     code: "custom",
    //     path: ["expectedExitDate"],
    //     message: "Expected exit date is required",
    //   });
    // }

    if (
      data.joiningDate &&
      data.expectedExitDate &&
      data.joiningDate > data.expectedExitDate
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["expectedExitDate"],
        message: "Expected exit date must be after joining date",
      });
    }
  }
});

export const superAdmin = z.object({
  username: z.string().trim().nonempty("Full name is required"),
  email: z
    .string()
    .trim()
    .nonempty("Email is required")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
  phoneNumber: z.string().nonempty("Phone number is required"),
  role: z.enum(Role),

  roleType: z.enum(SuperAdminRoleType).optional(),
  accessScope: z.enum(SuperAdminAccessScope).optional(),
});

export type SuperAdmin = z.infer<typeof superAdmin>;
export type Signup = z.infer<typeof signup>;
export type Login = z.infer<typeof login>;
