import express from "express";
import CampusController from "./campus.controller";
import { allowRoles } from "@/middleware/allowRoles.js";
import { auth } from "@/middleware/authMiddleware.js";
const campusRouter = express.Router();
const campusController = new CampusController();

campusRouter.post("/", auth, allowRoles(["superadmin"]), (req, res, next) =>
  campusController.createCampus(req, res, next),
);

campusRouter.get(
  "/:campusId",
  auth,
  allowRoles(["superadmin", "admin"]),
  (req, res, next) => campusController.getCampusDetail(req, res, next),
);

campusRouter.get(
  "/",
  auth,
  (req, res, next) => campusController.getCampuses(req, res, next),
);

campusRouter.patch(
  "/:campusId",
  auth,
  allowRoles(["superadmin"]),
  (req, res, next) => campusController.updateCampus(req, res, next),
);

campusRouter.delete(
  "/:campusId",
  auth,
  allowRoles(["superadmin"]),
  (req, res, next) => campusController.deleteCampus(req, res, next),
);


// assign admin
campusRouter.patch(
  "/:campusId/assign-admin/:adminId",
  auth,
  allowRoles(["superadmin"]),
  (req, res, next) => campusController.assignAdmin(req, res, next),
);

// remove admin
campusRouter.patch(
  "/:campusId/unassign-admin/:adminId",
  auth,
  allowRoles(["superadmin"]),
  (req, res, next) => campusController.removeAdmin(req, res, next),
);



export default campusRouter;
