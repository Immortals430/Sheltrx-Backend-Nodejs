import { Router } from "express";
import BedController from "./bed.controller.js";
import { auth } from "@/middleware/authMiddleware.js";
import { allowRoles } from "@/middleware/allowRoles.js";

const bedRouter = Router();
const bedController = new BedController();

// get beds
bedRouter.get(
  "/",
  auth,
  allowRoles(["superadmin", "admin", "warden"]),
  (req, res, next) => bedController.getBeds(req, res, next),
);

// // GET /api/v1/bed/:id  — get single bed
// // bedRouter.get(
// //   "/:id",
// //   auth,
// //   allowRoles(["Superadmin", "admin", "warden"]),
// //   (req, res, next) => bedController.getBedById(req, res, next),
// // );

//  create bed
bedRouter.post(
  "/",
  auth,
  allowRoles(["superadmin", "admin"]),
  (req, res, next) => bedController.createBed(req, res, next),
);

// PATCH /api/v1/bed/:id  — update a single bed
bedRouter.patch(
  "/:bedId",
  auth,
  allowRoles(["superadmin", "admin"]),
  (req, res, next) => bedController.updateBed(req, res, next),
);

// delete bed
bedRouter.delete(
  "/:bedId",
  auth,
  allowRoles(["superadmin", "admin"]),
  (req, res, next) => bedController.deleteBed(req, res, next),
);

export default bedRouter;
