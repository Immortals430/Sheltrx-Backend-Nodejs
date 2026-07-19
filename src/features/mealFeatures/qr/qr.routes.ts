import express from "express";
import QrController from "./qr.controller";
import { allowRoles } from "@/middleware/allowRoles.js";
import { auth } from "@/middleware/authMiddleware.js";
const qrRouter = express.Router();
const qrController = new QrController();

// create qr code
// get qr code of hostels by campus
// scan qr

qrRouter.post(
  "/",
  auth,
  allowRoles(["superadmin", "admin"]),
  (req, res, next) => qrController.createQr(req, res, next),
);

qrRouter.get("/", auth, allowRoles(["superadmin", "admin"]), (req, res, next) =>
  qrController.getQrs(req, res, next),
);

qrRouter.post("/scan-log", auth, allowRoles(["tenant"]), (req, res, next) =>
  qrController.scanQr(req, res, next),
);

// qrRouter.patch(
//   "/:qrId",
//   auth,
//   allowRoles(["superadmin", "admin"]),
//   (req, res, next) => qrController.updateQr(req, res, next),
// );

// qrRouter.delete(
//   "/:qrId",
//   auth,
//   allowRoles(["superadmin", "admin"]),
//   (req, res, next) => qrController.deleteQr(req, res, next),
// );

export default qrRouter;
