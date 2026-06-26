import express from "express";
import AuthController from "./auth.controller.js";
import { allowRoles } from "@/middleware/allowRoles.js";
import { auth } from "@/middleware/authMiddleware.js";
const authRouter = express.Router();
const authController = new AuthController();

authRouter.post("/create-super-admin", (req, res, next) =>
  authController.createSuperAdmin(req, res, next),
);

authRouter.post("/login", (req, res, next) =>
  authController.login(req, res, next),
);

authRouter.post("/signup", auth, allowRoles(["superadmin"]), (req, res, next) =>
  authController.signup(req, res, next),
);

authRouter.post("/logout", (req, res, next) =>
  authController.logout(req, res, next),
);

export default authRouter;
