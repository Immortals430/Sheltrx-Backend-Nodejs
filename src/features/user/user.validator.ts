import { Role } from "generated/prisma/enums";
import { z } from "zod";

// export const createUser = z.object({
//   username: z.string().trim().nonempty("Full name is required"),
//   email: z
//     .string()
//     .trim()
//     .nonempty("Email is required")
//     .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
//   phoneNumber: z.string().nonempty("Phone number is required"),
//   role: z.enum(Role),
// });

// export type CreateUser = z.infer<typeof createUser>;
