import type { NextFunction, Request, Response } from "express";
import AdminService from "./admin.service";
import { ApplicationError } from "@/middleware/errorHandler";
import { adminQueries } from "./admin.validator";

export default class AdminController {
  adminService;
  constructor() {
    this.adminService = new AdminService();
  }

  async getAdmins(req: Request, res: Response, next: NextFunction) {
    try {
      const queries = adminQueries.parse(req.query);
      const currentUser = req.session.user;

      if (!currentUser) {
        throw new ApplicationError("User mot found", 404);
      }

      const admins = await this.adminService.getAdmins(currentUser, queries);

      res.status(200).json({
        data: admins,
      });
    } catch (error) {
      next(error);
    }
  }
}
