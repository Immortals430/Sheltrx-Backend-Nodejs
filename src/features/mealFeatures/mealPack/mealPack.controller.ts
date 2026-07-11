import type { Request, Response, NextFunction } from "express";
import {
  createMealPack,
  mealPackQueries,
  updateMealPack,
} from "./mealPack.validator";
import { ApplicationError } from "@/middleware/errorHandler";
import MealPackService from "./mealPack.service";

export default class MealPackController {
  mealPackService;

  constructor() {
    this.mealPackService = new MealPackService();
  }

  // get meal packs
  async getMealPacks(req: Request, res: Response, next: NextFunction) {
    try {
      const queries = mealPackQueries.parse(req.query);
      const currentUser = req.session.user;

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }

      const mealPacks = await this.mealPackService.getMealPacks(
        queries,
        currentUser,
      );

      return res.status(200).json({ data: mealPacks });
    } catch (error) {
      next(error);
    }
  }

  // create meal pack
  async createMealPack(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = createMealPack.parse(req.body);
      const currentUser = req.session.user;

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }

      const mealPack = await this.mealPackService.createMealPack(
        payload,
        currentUser,
      );

      return res.status(201).json({
        message: "Meal pack created successfully",
        data: mealPack,
      });
    } catch (error) {
      next(error);
    }
  }

  // update meal pack
  async updateMealPack(req: Request, res: Response, next: NextFunction) {
    try {
      const mealPackId = Number(req.params.mealPackId);
      const currentUser = req.session.user;
      const payload = updateMealPack.parse(req.body);

      if (!mealPackId) {
        throw new ApplicationError("Meal pack id is required", 400);
      }

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }

      const mealPack = await this.mealPackService.updateMealPack(
        mealPackId,
        currentUser,
        payload,
      );

      return res.status(200).json({
        message: "Meal pack updated successfully",
        data: mealPack,
      });
    } catch (error) {
      next(error);
    }
  }

  // delete meal pack
  async deleteMealPack(req: Request, res: Response, next: NextFunction) {
    try {
      const mealPackId = Number(req.params.mealPackId);
      const currentUser = req.session.user;

      if (!mealPackId) {
        throw new ApplicationError("Meal pack id is required", 400);
      }

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }

      const mealPack = await this.mealPackService.deleteMealPack(
        mealPackId,
        currentUser,
      );

      return res.status(200).json({
        message: "Meal pack deleted successfully",
        data: mealPack,
      });
    } catch (error) {
      next(error);
    }
  }
}
