import type { Request, Response, NextFunction } from "express";
import {
  createMenuPreset,
  menuPresetQueries,
  // updateMenuPreset,
} from "./menuPreset.validator";
import { ApplicationError } from "@/middleware/errorHandler";
import MenuPresetService from "./menuPreset.service";

export default class MenuPresetController {
  menuPresetService;

  constructor() {
    this.menuPresetService = new MenuPresetService();
  }

  // get menu presets
  async getMenuPresets(req: Request, res: Response, next: NextFunction) {
    try {
      const queries = menuPresetQueries.parse(req.query);
      const currentUser = req.session.user;

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }

      const menuPresets = await this.menuPresetService.getMenuPresets(
        queries,
        currentUser,
      );

      return res.status(200).json({ data: menuPresets });
    } catch (error) {
      next(error);
    }
  }

  // create menu preset
  async createMenuPreset(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = createMenuPreset.parse(req.body);
      const currentUser = req.session.user;

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }

      const menuPreset = await this.menuPresetService.createMenuPreset(
        payload,
        currentUser,
      );

      return res.status(201).json({
        message: "Menu preset created successfully",
        data: menuPreset,
      });
    } catch (error) {
      next(error);
    }
  }

  // update menu preset
  // async updateMenuPreset(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const menuPresetId = Number(req.params.menuPresetId);
  //     const currentUser = req.session.user;
  //     const payload = updateMenuPreset.parse(req.body);

  //     if (!menuPresetId) {
  //       throw new ApplicationError("Menu preset id is required", 400);
  //     }

  //     if (!currentUser) {
  //       throw new ApplicationError("User not found", 404);
  //     }

  //     const menuPreset = await this.menuPresetService.updateMenuPreset(
  //       menuPresetId,
  //       currentUser,
  //       payload,
  //     );

  //     return res.status(200).json({
  //       message: "Menu preset updated successfully",
  //       data: menuPreset,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // delete menu preset
  async deleteMenuPreset(req: Request, res: Response, next: NextFunction) {
    try {
      const menuPresetId = Number(req.params.menuPresetId);
      const currentUser = req.session.user;

      if (!menuPresetId) {
        throw new ApplicationError("Menu preset id is required", 400);
      }

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }

      const menuPreset = await this.menuPresetService.deleteMenuPreset(
        menuPresetId,
        currentUser,
      );

      return res.status(200).json({
        message: "Menu preset deleted successfully",
        data: menuPreset,
      });
    } catch (error) {
      next(error);
    }
  }
}
