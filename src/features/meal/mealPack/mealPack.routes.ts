import express from "express";
import MealPackController from "./mealPack.controller"
import { allowRoles } from "@/middleware/allowRoles.js";
import { auth } from "@/middleware/authMiddleware.js";
const mealPackRouter = express.Router();
const mealPackController = new MealPackController();

mealPackRouter.post("/", auth, allowRoles(["superadmin", "admin"]), (req, res, next) =>
  mealPackController.createMealPack(req, res, next),
);

mealPackRouter.get(
  "/",
  auth,
  allowRoles(["superadmin", "admin"]),
  (req, res, next) => mealPackController.getMealPacks(req, res, next),
);

mealPackRouter.patch(
  "/:mealPackId",
  auth,
  allowRoles(["superadmin", "admin"]),
  (req, res, next) => mealPackController.updateMealPack(req, res, next),
);

mealPackRouter.delete(
  "/:mealPackId",
  auth,
  allowRoles(["superadmin", "admin"]),
  (req, res, next) => mealPackController.deleteMealPack(req, res, next),
);

export default mealPackRouter;
