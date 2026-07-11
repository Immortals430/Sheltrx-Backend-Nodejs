import express from "express";
import FoodMenuController from "./foodMenu.controller";
import { allowRoles } from "@/middleware/allowRoles.js";
import { auth } from "@/middleware/authMiddleware.js";
const foodMenuRouter = express.Router();
const foodMenuController = new FoodMenuController();

foodMenuRouter.post(
  "/",
  auth,
  allowRoles(["superadmin", "admin"]),
  (req, res, next) => foodMenuController.createFoodMenu(req, res, next),
);

// foodMenuRouter.get(
//   "/",
//   auth,
//   allowRoles(["tenant"]),
//   (req, res, next) =>
//     foodMenuController.getFoodMenus(req, res, next),
// );

// foodMenuRouter.patch(
//   "/:foodMenuId",
//   auth,
//   allowRoles(["superadmin", "admin"]),
//   (req, res, next) =>
//     foodMenuController.updateFoodMenu(req, res, next),
// );

// foodMenuRouter.delete(
//   "/:foodMenuId",
//   auth,
//   allowRoles(["superadmin", "admin"]),
//   (req, res, next) =>
//     foodMenuController.deleteFoodMenu(req, res, next),
// );

export default foodMenuRouter;
