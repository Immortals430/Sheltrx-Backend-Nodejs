import express from "express";
import HostelController from "./hostel.controller";
import { allowRoles } from "@/middleware/allowRoles.js";
import { auth } from "@/middleware/authMiddleware.js";

const hostelRouter = express.Router();
const hostelController = new HostelController();

hostelRouter.get("/", auth, (req, res, next) =>
  hostelController.getHostels(req, res, next),
);

hostelRouter.get("/:hostelId", auth, (req, res, next) =>
  hostelController.getHostelDetail(req, res, next),
);

hostelRouter.post(
  "/",
  auth,
  allowRoles(["superadmin", "admin"]),
  (req, res, next) => hostelController.createHostel(req, res, next),
);

hostelRouter.patch(
  "/:hostelId",
  auth,
  allowRoles(["superadmin", "admin"]),
  (req, res, next) => hostelController.updateHostel(req, res, next),
);

hostelRouter.delete(
  "/:hostelId",
  auth,
  allowRoles(["superadmin"]),
  (req, res, next) => hostelController.deleteHostel(req, res, next),
);



// assign warden
hostelRouter.patch(
  "/:hostelId/assign-warden/:wardenId",
  auth,
  allowRoles(["superadmin"]),
  (req, res, next) => hostelController.assignWarden(req, res, next),
);

// remove warden
hostelRouter.patch(
  "/:hostelId/unassign-warden/:wardenId",
  auth,
  allowRoles(["superadmin"
  ]),
  (req, res, next) => hostelController.removeWarden(req, res, next),
);




// assign staff
hostelRouter.patch(
  "/:hostelId/assign-staff/:staffId",
  auth,
  allowRoles(["superadmin"]),
  (req, res, next) => hostelController.assignStaff(req, res, next),
);

// remove staff
hostelRouter.patch(
  "/:hostelId/unassign-staff/:staffId",
  auth,
  allowRoles(["superadmin"]),
  (req, res, next) => hostelController.removeStaff(req, res, next),
);

export default hostelRouter;
