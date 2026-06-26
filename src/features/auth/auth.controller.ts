import type { NextFunction, Request, Response } from "express";
import AuthService from "./auth.service.js";
import { signup, superAdmin, login } from "./auth.validator.js";

const PROJECT_NAME = process.env.PROJECT_NAME || "Project";
const isProduction = process.env.NODE_ENV === "production";

export default class AuthController {
  authService;
  constructor() {
    this.authService = new AuthService();
  }

  // create super admin
  async createSuperAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const secret = req.headers["authorization"] || "";
      const payload = superAdmin.parse(req.body);
      const user = await this.authService.createSuperAdmin(payload, secret);
      res.status(200).json({
        success: true,
        message: "Superadmin created successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  // login
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = login.parse(req.body);

      const { user, message } = await this.authService.login(payload);

      if (!user) {
        return res.status(200).json({ success: true, message });
      }

      req.session.regenerate(async (err) => {
        if (err) return next(err);

        req.session.user = {
          userId: user.id,
          email: user.email,
          role: user.role,
        };

        await this.authService.saveAuthUserSession(
          String(user.id),
          req.sessionID,
        );

        req.session.save((saveErr) => {
          if (saveErr) return next(saveErr);

          res.status(200).json({
            success: true,
            message,
            data: user,
          });
        });
      });
    } catch (error) {
      next(error);
    }
  }


  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = signup.parse(req.body);
      await this.authService.signup(payload);
      res.status(200).json({ success: true, message: "Signup successful" });
    } catch (error) {
      next(error);
    }
  }



  // logout
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.session.user?.userId;

      req.session.destroy(async (err) => {
        if (err) return next(err);

        if (userId) {
          await this.authService.clearAuthUserSession(String(userId));
        }

        res
          .clearCookie("connect.sid", {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
          })
          .status(200)
          .json({
            success: true,
            message: "Logged out successfully",
          });
      });
    } catch (error) {
      next(error);
    }
  }
}
