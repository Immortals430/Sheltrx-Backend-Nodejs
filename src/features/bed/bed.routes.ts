// import { Router } from "express";
// import BedController from "./bed.controller.js";
// import { auth } from "@/middleware/authMiddleware.js";
// import { allowRoles } from "@/middleware/allowRoles.js";

// const bedRouter = Router();
// const bedController = new BedController();

// // GET /api/v1/bed  — list beds with optional filters
// // bedRouter.get(
// //   "/",
// //   auth,
// //   allowRoles(["Superadmin", "admin", "warden"]),
// //   (req, res, next) => bedController.getBeds(req, res, next),
// // );

// // GET /api/v1/bed/:id  — get single bed
// // bedRouter.get(
// //   "/:id",
// //   auth,
// //   allowRoles(["Superadmin", "admin", "warden"]),
// //   (req, res, next) => bedController.getBedById(req, res, next),
// // );

// // POST /api/v1/bed  — bulk create beds (array)
// bedRouter.post(
//   "/",
//   auth,
//   allowRoles(["Superadmin", "admin"]),
//   (req, res, next) => bedController.createBeds(req, res, next),
// );

// // PATCH /api/v1/bed/:id  — update a single bed
// // bedRouter.patch(
// //   "/:id",
// //   auth,
// //   allowRoles(["Superadmin", "admin", "warden"]),
// //   (req, res, next) => bedController.updateBed(req, res, next),
// // );

// // DELETE /api/v1/bed/:id  — delete a single bed
// // bedRouter.delete(
// //   "/:id",
// //   auth,
// //   allowRoles(["Superadmin", "admin", "warden"]),
// //   (req, res, next) => bedController.deleteBed(req, res, next),
// // );

// export default bedRouter;
