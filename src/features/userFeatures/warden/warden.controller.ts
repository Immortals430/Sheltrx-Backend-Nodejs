import type { Request, Response, NextFunction } from "express";
import WardenService from "./warden.service.js";
import { ApplicationError } from "@/middleware/errorHandler.js";
import { wardenQueries } from "./warden.validator.js";

export default class WardenController {
  wardenService;

  constructor() {
    this.wardenService = new WardenService();
  }

  async getWardens(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUser = req.session.user;
      const queries = wardenQueries.parse(req.query);

      if (!currentUser) {
        throw new ApplicationError("Warden not found", 404);
      }

      const warden = await this.wardenService.getWardens(currentUser, queries);

      return res.status(200).json({ data: warden });
    } catch (error) {
      next(error);
    }
  }
}
