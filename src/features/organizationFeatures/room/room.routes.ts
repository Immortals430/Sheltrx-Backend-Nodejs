import { Router } from "express";
import RoomController from "./room.controller.js";
import { auth } from "@/middleware/authMiddleware.js";
import { allowRoles } from "@/middleware/allowRoles.js";

const roomRouter = Router();
const roomController = new RoomController();

roomRouter.get(
  "/",
  auth,
  allowRoles(["superadmin", "admin", "warden"]),
  (req, res, next) => roomController.getRooms(req, res, next),
);

roomRouter.post("/", auth,  allowRoles(["superadmin", "admin"]), (req, res, next) =>
  roomController.createRoom(req, res, next),
);

roomRouter.delete("/:roomId", auth,  allowRoles(["superadmin", "admin"]), (req, res, next) =>
  roomController.deleteRoom(req, res, next),
);

roomRouter.patch("/:roomId", auth,  allowRoles(["superadmin", "admin"]), (req, res, next) =>
  roomController.updateRoom(req, res, next),
);

export default roomRouter;
