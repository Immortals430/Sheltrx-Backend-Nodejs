import { Router } from "express";
import StaffController from "./staff.controller.js";
import { auth } from "@/middleware/authMiddleware.js";
const staffRouter = Router();
const staffController = new StaffController();

staffRouter.get("/", auth, (req, res, next) =>
  staffController.getStaff(req, res, next),
);

export default staffRouter;
