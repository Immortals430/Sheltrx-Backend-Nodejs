import type { Request, Response, NextFunction } from "express";
import {
  createFoodMenu,
  foodMenuQueries,
  updateFoodMenu,

  // updateFoodMenu,
} from "./foodMenu.validator";
import { ApplicationError } from "@/middleware/errorHandler";
import FoodMenuService from "./foodMenu.service";

export default class FoodMenuController {
  foodMenuService;

  constructor() {
    this.foodMenuService = new FoodMenuService();
  }

  // get food menus
  async getFoodMenus(req: Request, res: Response, next: NextFunction) {
    try {
      const queries = foodMenuQueries.parse(req.query);
      const currentUser = req.session.user;

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }

      const foodMenus = await this.foodMenuService.getFoodMenus(
        queries,
        currentUser,
      );

      return res.status(200).json({ data: foodMenus });
    } catch (error) {
      next(error);
    }
  }

  // create food menu
  async createFoodMenu(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = createFoodMenu.parse(req.body);
      const currentUser = req.session.user;

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }

      const foodMenu = await this.foodMenuService.createFoodMenu(
        payload,
        currentUser,
      );

      return res.status(201).json({
        message: "Food menu created successfully",
        data: foodMenu,
      });
    } catch (error) {
      next(error);
    }
  }

  // update food menu
  async updateFoodMenu(req: Request, res: Response, next: NextFunction) {
    try {
      const foodMenuId = Number(req.params.foodMenuId);
      const currentUser = req.session.user;
      const payload = updateFoodMenu.parse(req.body);

      if (!foodMenuId) {
        throw new ApplicationError("Food menu id is required", 400);
      }

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }

      // const foodMenu = await this.foodMenuService.updateFoodMenu(
      //   foodMenuId,
      //   currentUser,
      //   payload,
      // );

      return res.status(200).json({
        message: "Food menu updated successfully",
        // data: foodMenu,
      });
    } catch (error) {
      next(error);
    }
  }

  // delete food menu
  async deleteFoodMenu(req: Request, res: Response, next: NextFunction) {
    try {
      const foodMenuId = Number(req.params.foodMenuId);
      const currentUser = req.session.user;

      if (!foodMenuId) {
        throw new ApplicationError("Food menu id is required", 400);
      }

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }

      const foodMenu = await this.foodMenuService.deleteFoodMenu(
        foodMenuId,
        currentUser,
      );

      return res.status(200).json({
        message: "Food menu deleted successfully",
        data: foodMenu,
      });
    } catch (error) {
      next(error);
    }
  }
}
