import { Router } from "express";
import RoomTypeController from "./roomType.controller.js";
import { auth } from "@/middleware/authMiddleware.js";
import { allowRoles } from "@/middleware/allowRoles.js";

const roomTypeRouter = Router();
const roomTypeController = new RoomTypeController();

roomTypeRouter.get("/", auth, (req, res, next) =>
  roomTypeController.getRoomTypes(req, res, next),
);

roomTypeRouter.post("/", auth, allowRoles(["superadmin", "admin"]), (req, res, next) =>
  roomTypeController.createRoomType(req, res, next),
);

roomTypeRouter.delete("/:roomTypeId", auth, allowRoles(["superadmin", "admin"]), (req, res, next) =>
  roomTypeController.deleteRoomType(req, res, next),
);


roomTypeRouter.patch("/:roomTypeId", auth, allowRoles(["superadmin", "admin"]), (req, res, next) =>
  roomTypeController.updateRoomType(req, res, next),
);


export default roomTypeRouter;
