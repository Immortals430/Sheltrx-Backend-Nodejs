import { Router } from "express";
import UserController from "./user.controller.js";
import { auth } from "@/middleware/authMiddleware.js";
const userRouter = Router();
const userController = new UserController();

userRouter.get("/me", auth, (req, res, next) =>
  userController.getCurrentUser(req, res, next),
);

export default userRouter;
