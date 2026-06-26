import type { Request, Response, NextFunction } from "express";
import UserService from "./user.service.js";
import { ApplicationError } from "@/middleware/errorHandler.js";

export default class UserController {
  userService;

  constructor() {
    this.userService = new UserService();
  }

  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUser = req.session.user;

      if(!currentUser){
        throw new ApplicationError("User not found", 404)
      }
      
      // const user = await this.userService.getUserById(currentUser);

      // return res.status(200).json({ data: user });
    } catch (error) {
      next(error);
    }
  }
}
