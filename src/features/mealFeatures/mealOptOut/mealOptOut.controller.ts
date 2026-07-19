import type { Request, Response, NextFunction } from "express";
import { createMealOptOut } from "./mealOptOut.validator";
import { ApplicationError } from "@/middleware/errorHandler";
import MealOptOutService from "./mealOptOut.service";

export default class MealOptOutController {
  mealOptOutService;

  constructor() {
    this.mealOptOutService = new MealOptOutService();
  }

  // create meal opt-out (tenant only)
  async createMealOptOut(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = createMealOptOut.parse(req.body);
      const currentUser = req.session.user;

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }

      const mealOptOut = await this.mealOptOutService.createMealOptOut(
        payload,
        currentUser,
      );

      return res.status(201).json({
        message: "Meal opt-out recorded successfully",
        data: mealOptOut,
      });
    } catch (error) {
      next(error);
    }
  }
}
