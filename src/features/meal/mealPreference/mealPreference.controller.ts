import type { Request, Response, NextFunction } from "express";
import {
  createMealPreference,

  mealPreferenceQueries,

  updateMealPreference,
} from "./mealPreference.validator";
import { ApplicationError } from "@/middleware/errorHandler";
import MealPreferenceService from "./mealPreference.service";

export default class MealPreferenceController {
  mealPreferenceService;

  constructor() {
    this.mealPreferenceService = new MealPreferenceService();
  }

  // get meal preferences
  async getMealPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const queries = mealPreferenceQueries.parse(req.query);
      const currentUser = req.session.user;

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }

      const mealPreferences = await this.mealPreferenceService.getMealPreferences(
        queries,
        currentUser,
      );

      return res.status(200).json({ data: mealPreferences });
    } catch (error) {
      next(error);
    }
  }

  // create meal preference
  async createMealPreference(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = createMealPreference.parse(req.body);
      const currentUser = req.session.user;

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }

      const mealPreference = await this.mealPreferenceService.createMealPreference(
        payload,
        currentUser,
      );

      return res.status(201).json({
        message: "Meal preference created successfully",
        data: mealPreference,
      });
    } catch (error) {
      next(error);
    }
  }

  // update meal preference
  // async updateMealPreference(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const mealPreferenceId = Number(req.params.mealPreferenceId);
  //     const currentUser = req.session.user;
  //     const payload = updateMealPreference.parse(req.body);

  //     if (!mealPreferenceId) {
  //       throw new ApplicationError("Meal preference id is required", 400);
  //     }

  //     if (!currentUser) {
  //       throw new ApplicationError("User not found", 404);
  //     }

  //     const mealPreference = await this.mealPreferenceService.updateMealPreference(
  //       mealPreferenceId,
  //       currentUser,
  //       payload,
  //     );

  //     return res.status(200).json({
  //       message: "Meal preference updated successfully",
  //       data: mealPreference,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // delete meal preference
  async deleteMealPreference(req: Request, res: Response, next: NextFunction) {
    try {
      const mealPreferenceId = Number(req.params.mealPreferenceId);
      const currentUser = req.session.user;

      if (!mealPreferenceId) {
        throw new ApplicationError("Meal preference id is required", 400);
      }

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }

      const mealPreference = await this.mealPreferenceService.deleteMealPreference(
        mealPreferenceId,
        currentUser,
      );

      return res.status(200).json({
        message: "Meal preference deleted successfully",
        data: mealPreference,
      });
    } catch (error) {
      next(error);
    }
  }
}
