import express from "express";
import MealOptOutController from "./mealOptOut.controller";
import { allowRoles } from "@/middleware/allowRoles.js";
import { auth } from "@/middleware/authMiddleware.js";

const mealOptOutRouter = express.Router();
const mealOptOutController = new MealOptOutController();

// POST /meal-opt-out — tenant opts out of a meal for a specific date
mealOptOutRouter.post(
  "/",
  auth,
  allowRoles(["tenant"]),
  (req, res, next) => mealOptOutController.createMealOptOut(req, res, next),
);

export default mealOptOutRouter;
