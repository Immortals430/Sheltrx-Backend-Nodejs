// const token = crypto.randomBytes(32).toString("base64url");

import type { Request, Response, NextFunction } from "express";
import { createQr, getQrs, scanQr } from "./qr.validator";
import { ApplicationError } from "@/middleware/errorHandler";
import QrService from "./qr.service";

export default class QrController {
  qrService;

  constructor() {
    this.qrService = new QrService();
  }

  // create qr
  async createQr(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = createQr.parse(req.body);
      const currentUser = req.session.user;

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }

      const qr = await this.qrService.createQr(payload, currentUser);

      return res.status(201).json({
        message: "Qr created successfully",
        data: qr,
      });
    } catch (error) {
      next(error);
    }
  }

  // get qr
  async getQrs(req: Request, res: Response, next: NextFunction) {
    try {
      const queries = getQrs.parse(req.query);
      const currentUser = req.session.user;

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }

      const qr = await this.qrService.getQrs(queries, currentUser);

      return res.status(200).json({
        data: qr,
      });
    } catch (error) {
      next(error);
    }
  }

  // scan qr
  async scanQr(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = scanQr.parse(req.body);
      const currentUser = req.session.user;

      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }

      const scannedMeal = await this.qrService.scanQr(payload, currentUser);

      return res.status(200).json({
        data: scannedMeal,
      });
    } catch (error) {
      next(error);
    }
  }
}
