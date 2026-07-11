import express from "express";
import MealTypeController from "./mealType.controller"
import { allowRoles } from "@/middleware/allowRoles.js";
import { auth } from "@/middleware/authMiddleware.js";
const mealTypeRouter = express.Router();
const mealTypeController = new MealTypeController();

mealTypeRouter.post("/", auth, allowRoles(["superadmin", "admin"]), (req, res, next) =>
  mealTypeController.createMealType(req, res, next),
);

mealTypeRouter.get(
  "/",
  auth,
  allowRoles(["superadmin", "admin", "warden", "staff"]),
  (req, res, next) => mealTypeController.getMealTypes(req, res, next),
);

mealTypeRouter.patch( 
  "/:mealTypeId",
  auth,
  allowRoles(["superadmin", "admin"]),
  (req, res, next) => mealTypeController.updateMealType(req, res, next),
);

mealTypeRouter.delete(
  "/:mealTypeId",
  auth,
  allowRoles(["superadmin", "admin"]),
  (req, res, next) => mealTypeController.deleteMealType(req, res, next),
);

export default mealTypeRouter;
