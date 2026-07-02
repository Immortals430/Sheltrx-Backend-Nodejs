import type { Request, Response, NextFunction } from "express";
import { createRoom, roomQueries, updateRoom } from "./room.validator";
import { ApplicationError } from "@/middleware/errorHandler";
import RoomService from "./room.service";

export default class RoomController {
  roomService;
  constructor() {
    this.roomService = new RoomService();
  }

  async getRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUser = req.session.user;
      const queries = roomQueries.parse(req.query);

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }

      const rooms = await this.roomService.getRooms(currentUser, queries);

      return res.status(200).json({ data: rooms });
    } catch (error) {
      next(error);
    }
  }

  async createRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = createRoom.parse(req.body);
      const room = await this.roomService.createRoom(payload);
      return res.status(201).json({
        message: "Room created successfully",
        data: room,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUser = req.session.user;
      const roomId = Number(req.params.roomId);
      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }
      const deletedRoom = await this.roomService.deleteRoom(
        roomId,
        currentUser,
      );
      return res.status(200).json({
        message: "Room deleted successfully",
        data: deletedRoom,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUser = req.session.user;
      const roomId = Number(req.params.roomId);
      const payload = updateRoom.parse(req.body);

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }
      const updatedRoom = await this.roomService.updateRoom(
        roomId,
        currentUser,
        payload,
      );
      return res.status(200).json({
        message: "Room updated successfully",
        data: updatedRoom,
      });
    } catch (error) {
      next(error);
    }
  }
}
