import type { Request, Response, NextFunction } from "express";
import {
  createMealType,
  mealTypeQueries,
  updateMealType,
} from "./mealType.validator";
import { ApplicationError } from "@/middleware/errorHandler";
import MealTypeService from "./mealType.service";

export default class MealTypeController {
  mealTypeService;

  constructor() {
    this.mealTypeService = new MealTypeService();
  }

  // get meal types
  async getMealTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const queries = mealTypeQueries.parse(req.query);
      const currentUser = req.session.user;

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }

      const mealTypes = await this.mealTypeService.getMealTypes(
        queries,
        currentUser,
      );

      return res.status(200).json({ data: mealTypes });
    } catch (error) {
      next(error);
    }
  }

  // create meal type
  async createMealType(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = createMealType.parse(req.body);
      const currentUser = req.session.user;

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }
      const mealType = await this.mealTypeService.createMealType(
        payload,
        currentUser,
      );

      return res.status(201).json({
        message: "Meal type created successfully",
        data: mealType,
      });
    } catch (error) {
      next(error);
    }
  }



  // update meal type
  async updateMealType(req: Request, res: Response, next: NextFunction) {
    try {
      const mealTypeId = Number(req.params.mealTypeId);
      const currentUser = req.session.user;
      const payload = updateMealType.parse(req.body);

      if (!mealTypeId) {
        throw new ApplicationError("Meal type id is required", 400);
      }

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }

      const mealType = await this.mealTypeService.updateMealType(
        mealTypeId,
        currentUser,
        payload,
      );

      return res.status(200).json({
        message: "Meal type updated successfully",
        data: mealType,
      });
    } catch (error) {
      next(error);
    }
  }

  // delete meal type
  async deleteMealType(req: Request, res: Response, next: NextFunction) {
    try {
      const mealTypeId = Number(req.params.mealTypeId);
      const currentUser = req.session.user;

      if (!mealTypeId) {
        throw new ApplicationError("Meal type id is required", 400);
      }

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }

      const mealType = await this.mealTypeService.deleteMealType(
        mealTypeId,
        currentUser,
      );

      return res.status(200).json({
        message: "Meal type deleted successfully",
        data: mealType,
      });
    } catch (error) {
      next(error);
    }
  }
}
