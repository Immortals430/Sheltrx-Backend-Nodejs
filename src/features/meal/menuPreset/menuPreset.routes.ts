import express from "express";
import MenuPresetController from "./menuPreset.controller";
import { allowRoles } from "@/middleware/allowRoles.js";
import { auth } from "@/middleware/authMiddleware.js";

const menuPresetRouter = express.Router();
const menuPresetController = new MenuPresetController();

menuPresetRouter.post("/", auth, allowRoles(["superadmin", "admin"]), (req, res, next) =>
  menuPresetController.createMenuPreset(req, res, next),
);

menuPresetRouter.get(
  "/",
  auth,
  allowRoles(["superadmin", "admin"]),
  (req, res, next) => menuPresetController.getMenuPresets(req, res, next),
);

// menuPresetRouter.patch(
//   "/:menuPresetId",
//   auth,
//   allowRoles(["superadmin", "admin"]),
//   (req, res, next) => menuPresetController.updateMenuPreset(req, res, next),
// );

menuPresetRouter.delete(
  "/:menuPresetId",
  auth,
  allowRoles(["superadmin", "admin"]),
  (req, res, next) => menuPresetController.deleteMenuPreset(req, res, next),
);

export default menuPresetRouter;
