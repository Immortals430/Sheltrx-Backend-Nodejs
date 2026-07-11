import type { Request, Response, NextFunction } from "express";
// import StaffService from "./staff.service.js";
import { ApplicationError } from "@/middleware/errorHandler.js";
import StaffService from "./staff.service";
import { staffQueries } from "./staff.validator";

export default class StaffController {
  staffService;

  constructor() {
    this.staffService = new StaffService();
  }

  async getStaff(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUser = req.session.user;
      const queries = staffQueries.parse(req.query);

      if (!currentUser) {
        throw new ApplicationError("Staff not found", 404);
      }

      const staff = await this.staffService.getStaff(currentUser, queries);

      return res.status(200).json({ data: staff });
    } catch (error) {
      next(error);
    }
  }
}
