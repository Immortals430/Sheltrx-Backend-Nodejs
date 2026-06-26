import type { NextFunction, Request, Response } from "express";
import HostelService from "./hostel.service";
import { createHostel, hostelQueries, updateHostel } from "./hostel.validatior";
import { ApplicationError } from "@/middleware/errorHandler";

export default class HostelController {
  hostelService;
  constructor() {
    this.hostelService = new HostelService();
  }

  // get hostel
  async getHostels(req: Request, res: Response, next: NextFunction) {
    try {
      const queries = hostelQueries.parse(req.query);
      const currentUser = req.session.user;

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }

      const hostels = await this.hostelService.getHostels(currentUser, queries);

      return res.status(200).json({
        data: hostels,
      });
    } catch (err) {
      next(err);
    }
  }

  async getHostelDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { hostelId } = req.params;

      if (!hostelId || typeof hostelId !== "string") {
        throw new ApplicationError("Hostel id is required", 400);
      }

      const hostel = await this.hostelService.getHostelDetail(hostelId);
      return res.status(200).json({
        status: "success",
        data: hostel,
      });
    } catch (err) {
      next(err);
    }
  }

  // create hostel
  async createHostel(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = createHostel.parse(req.body);
      const hostel = await this.hostelService.createHostel(payload);
      return res.status(201).json({
        message: "Hostel created successfully",
        data: hostel,
      });
    } catch (err) {
      next(err);
    }
  }

  // update hostel
  async updateHostel(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = updateHostel.parse(req.body);
      const { hostelId } = req.params;

      if (!hostelId || typeof hostelId !== "string") {
        throw new ApplicationError("Hostel id is required", 400);
      }

      const hostel = await this.hostelService.updateHostel(hostelId, payload);

      return res.status(201).json({
        message: "Hostel updated successfully",
        data: hostel,
      });
    } catch (err) {
      next(err);
    }
  }

  // delete hostel
  async deleteHostel(req: Request, res: Response, next: NextFunction) {
    try {
      const { hostelId } = req.params;

      if (!hostelId || typeof hostelId !== "string") {
        throw new ApplicationError("Hostel id is required", 400);
      }

      const hostel = await this.hostelService.deleteHostel(hostelId);

      return res.status(201).json({
        message: "Hostel deleted successfully",
        data: hostel,
      });
    } catch (err) {
      next(err);
    }
  }

  // assign warden to hostel
  async assignWarden(req: Request, res: Response, next: NextFunction) {
    try {
      const { hostelId, wardenId } = req.params;
      const currentUser = req.session.user;

      if (
        !hostelId ||
        !wardenId ||
        !currentUser ||
        typeof hostelId !== "string" ||
        typeof wardenId !== "string"
      ) {
        throw new ApplicationError("Parameters missing", 400);
      }

      await this.hostelService.assignWarden(hostelId, wardenId, currentUser);

      res.status(201).json({
        message: "Warden assigned to hostel successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // unassign warden from hostel
  async removeWarden(req: Request, res: Response, next: NextFunction) {
    try {
      const { hostelId, wardenId } = req.params;
      const currentUser = req.session.user;

      if (
        !hostelId ||
        !wardenId ||
        !currentUser ||
        typeof hostelId !== "string" ||
        typeof wardenId !== "string"
      ) {
        throw new ApplicationError("Parameters missing", 400);
      }

      await this.hostelService.removeWarden(hostelId, wardenId, currentUser);

      res.status(201).json({
        message: "Warden unassigned from hostel successfully",
      });
    } catch (error) {
      next(error);
    }
  }








    // assign warden to hostel
  async assignStaff(req: Request, res: Response, next: NextFunction) {
    try {
      const { hostelId, staffId } = req.params;
      const currentUser = req.session.user;

      if (
        !hostelId ||
        !staffId ||
        !currentUser ||
        typeof hostelId !== "string" ||
        typeof staffId !== "string"
      ) {
        throw new ApplicationError("Parameters missing", 400);
      }

      await this.hostelService.assignStaff(hostelId, staffId, currentUser);

      res.status(201).json({
        message: "Staff assigned to hostel successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // unassign warden from hostel
  async removeStaff(req: Request, res: Response, next: NextFunction) {
    try {
      const { hostelId, staffId } = req.params;
      const currentUser = req.session.user;

      if (
        !hostelId ||
        !staffId ||
        !currentUser ||
        typeof hostelId !== "string" ||
        typeof staffId !== "string"
      ) {
        throw new ApplicationError("Parameters missing", 400);
      }

      await this.hostelService.removeStaff(hostelId, staffId, currentUser);

      res.status(201).json({
        message: "Staff unassigned from hostel successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
