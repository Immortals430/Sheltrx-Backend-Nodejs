import type { Role } from "generated/prisma/enums";
import "express-session";

export type CurrentUser = {
  userId: number;
  email: string;
  role: Role;
};

declare module "express-session" {
  interface SessionData {
    user?: CurrentUser;
  }
}