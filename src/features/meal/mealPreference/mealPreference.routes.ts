import express from "express";
import MealPreferenceController from "./mealPreference.controller";
import { allowRoles } from "@/middleware/allowRoles.js";
import { auth } from "@/middleware/authMiddleware.js";
const mealPreferenceRouter = express.Router();
const mealPreferenceController = new MealPreferenceController();

mealPreferenceRouter.post(
  "/",
  auth,
  allowRoles(["superadmin", "admin"]),
  (req, res, next) =>
    mealPreferenceController.createMealPreference(req, res, next),
);

mealPreferenceRouter.get(
  "/",
  auth,
  allowRoles(["tenant"]),
  (req, res, next) =>
    mealPreferenceController.getMealPreferences(req, res, next),
);

// mealPreferenceRouter.patch(
//   "/:mealPreferenceId",
//   auth,
//   allowRoles(["superadmin", "admin"]),
//   (req, res, next) =>
//     mealPreferenceController.updateMealPreference(req, res, next),
// );

mealPreferenceRouter.delete(
  "/:mealPreferenceId",
  auth,
  allowRoles(["superadmin", "admin"]),
  (req, res, next) =>
    mealPreferenceController.deleteMealPreference(req, res, next),
);

export default mealPreferenceRouter;
