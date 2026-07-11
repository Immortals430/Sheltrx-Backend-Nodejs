import express from "express";
import AdminController from "./admin.controller.js";
import { allowRoles } from "@/middleware/allowRoles.js";
import { auth } from "@/middleware/authMiddleware.js";
const adminRouter = express.Router();
const adminController = new AdminController();

adminRouter.get("/", auth, (req, res, next) =>
  adminController.getAdmins(req, res, next),
);

export default adminRouter;
