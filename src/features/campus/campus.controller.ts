import type { NextFunction, Request, Response } from "express";
import {
  assignAdmin,
  campusQueries,
  createCampus,
  updateCampus,
} from "./campus.validatior";
import CampusService from "./campus.service";
import { ApplicationError } from "@/middleware/errorHandler";

export default class CampusController {
  campusService;
  constructor() {
    this.campusService = new CampusService();
  }

  // create campus
  async createCampus(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = createCampus.parse(req.body);

      const campus = await this.campusService.createCampus(payload);

      res.status(201).json({
        message: "Campus created successfully",
        data: campus,
      });
    } catch (error) {
      next(error);
    }
  }

  // get campus
  async getCampuses(req: Request, res: Response, next: NextFunction) {
    try {
      const queries = campusQueries.parse(req.query);
      const currentUser = req.session.user;

      if (!currentUser) {
        throw new ApplicationError("User mot found", 404);
      }

      const campus = await this.campusService.getCampus(currentUser, queries);

      res.status(200).json({
        data: campus,
      });
    } catch (error) {
      next(error);
    }
  }

  // get campus detail
  async getCampusDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { campusId } = req.params;

      if (!campusId || typeof campusId !== "string") {
        throw new ApplicationError("Campus id is required", 400);
      }

      const campus = await this.campusService.getCampusDetail(campusId);

      res.status(200).json({
        data: campus,
      });
    } catch (error) {
      next(error);
    }
  }

  // update campus
  async updateCampus(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = updateCampus.parse(req.body);
      const { campusId } = req.params;

      if (!campusId || typeof campusId !== "string") {
        throw new ApplicationError("Campus id is required", 400);
      }

      const campus = await this.campusService.updateCampus(campusId, payload);

      res.status(201).json({
        message: "Campus updated successfully",
        data: campus,
      });
    } catch (error) {
      next(error);
    }
  }

  // delete campus
  async deleteCampus(req: Request, res: Response, next: NextFunction) {
    try {
      const { campusId } = req.params;

      if (!campusId || typeof campusId !== "string") {
        throw new ApplicationError("Campus id is required", 400);
      }

      const campus = await this.campusService.deleteCampus(campusId);

      res.status(201).json({
        message: "Campus deleted successfully",
        data: campus,
      });
    } catch (error) {
      next(error);
    }
  }

  // assign admin
  async assignAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { campusId, adminId } = req.params;
      const currentUser = req.session.user;

      if (
        !campusId ||
        !adminId ||
        !currentUser ||
        typeof campusId !== "string" ||
        typeof adminId !== "string"
      ) {
        throw new ApplicationError("Parameters missing", 400);
      }

      const campus = await this.campusService.assignAdmin(
        campusId,
        adminId,
        currentUser,
      );

      res.status(201).json({
        message: "Admin assigned to campus successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // remove admin
  async removeAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { campusId, adminId } = req.params;
      const currentUser = req.session.user;

      if (
        !campusId ||
        !adminId ||
        !currentUser ||
        typeof campusId !== "string" ||
        typeof adminId !== "string"
      ) {
        throw new ApplicationError("Parameters missing", 400);
      }

      const campus = await this.campusService.removeAdmin(
        campusId,
        adminId,
        currentUser,
      );

      res.status(201).json({
        message: "Admin unassigned from campus successfully",

      });
    } catch (error) {
      next(error);
    }
  }
}
