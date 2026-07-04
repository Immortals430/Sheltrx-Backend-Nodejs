import type { Request, Response, NextFunction } from "express";
import { bedQueries, createBeds, updateBed } from "./bed.validator";
import { ApplicationError } from "@/middleware/errorHandler";
import BedService from "./bed.service";

export default class BedController {
  bedService;

  constructor() {
    this.bedService = new BedService();
  }

  async getBeds(req: Request, res: Response, next: NextFunction) {
    try {
      const queries = bedQueries.parse(req.query);
      const currentUser = req.session.user;

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }

      const beds = await this.bedService.getBeds(queries, currentUser);
      return res.status(200).json({ data: beds });
    } catch (error) {
      next(error);
    }
  }

  //   async getBedById(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const id = Number(req.params.id);
  //       if (isNaN(id)) throw new ApplicationError("Invalid bed ID", 400);

  //       const bed = await this.bedService.getBedById(id);
  //       return res.status(200).json({ data: bed });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }

  async createBed(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = createBeds.parse(req.body);
      const currentUser = req.session.user;

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }
      const beds = await this.bedService.createBed(payload, currentUser);
      return res.status(201).json({
        message: "Bed created successfully",
        data: beds,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateBed(req: Request, res: Response, next: NextFunction) {
    try {
      const bedId = Number(req.params.bedId);
      const currentUser = req.session.user;

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }

      const payload = updateBed.parse(req.body);

      const bed = await this.bedService.updateBed(bedId, payload, currentUser);
      return res.status(200).json({
        message: "Bed updated successfully",
        data: bed,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteBed(req: Request, res: Response, next: NextFunction) {
    try {
      const bedId = Number(req.params.bedId);
      const currentUser = req.session.user;

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }


      const bed = await this.bedService.deleteBed(bedId, currentUser);
      return res.status(200).json({ message: "Bed deleted successfully", data: bed });
    } catch (error) {
      next(error);
    }
  }
}
