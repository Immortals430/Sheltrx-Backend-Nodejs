import type { Request, Response, NextFunction } from "express";
import {
  createRoomType,
  roomTypeQueries,
  updateRoomType,
} from "./roomType.validator";
import { ApplicationError } from "@/middleware/errorHandler";
import RoomTypeService from "./roomType.service";

export default class RoomTypeController {
  roomTypeService;
  constructor() {
    this.roomTypeService = new RoomTypeService();
  }

  async getRoomTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUser = req.session.user;
      const queries = roomTypeQueries.parse(req.query);

      if (!currentUser) {
        throw new ApplicationError("Warden not found", 404);
      }

      const roomTypes = await this.roomTypeService.getRoomTypes(
        currentUser,
        queries,
      );

      return res.status(200).json({ data: roomTypes });
    } catch (error) {
      next(error);
    }
  }

  async createRoomType(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = createRoomType.parse(req.body);
      const roomType = await this.roomTypeService.createRoomType(payload);
      return res.status(201).json({
        message: "Room type created successfully",
        data: roomType,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteRoomType(req: Request, res: Response, next: NextFunction) {
    try {
      const roomTypeId = Number(req.params.roomTypeId);
      const currentUser = req.session.user;

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }

      const roomType = await this.roomTypeService.deleteRoomType(
        roomTypeId,
        currentUser,
      );
      return res.status(200).json({
        message: "Room type deleted successfully",
        data: roomType,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRoomType(req: Request, res: Response, next: NextFunction) {
    try {
      const roomTypeId = Number(req.params.roomTypeId);
      const currentUser = req.session.user;
      const payload = updateRoomType.parse(req.body);

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }

      const roomType = await this.roomTypeService.updateRoomType(
        roomTypeId,
        currentUser,
        payload,
      );
      return res.status(200).json({
        message: "Room type updated successfully",
        data: roomType,
      });
    } catch (error) {
      next(error);
    }
  }
}
