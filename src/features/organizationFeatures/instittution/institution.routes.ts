import express from "express";
import InstitutionController from "./institution.controller";
import { allowRoles } from "@/middleware/allowRoles.js";
import { auth } from "@/middleware/authMiddleware.js";
const institutionRouter = express.Router();
const institutionController = new InstitutionController();

institutionRouter.post("/", auth, allowRoles(["superadmin"]), (req, res, next) =>
  institutionController.createInstitution(req, res, next),
);

institutionRouter.get(
  "/:institutionId",
  auth,
  allowRoles(["superadmin"]),
  (req, res, next) => institutionController.getInstitutionDetail(req, res, next),
);

institutionRouter.get(
  "/",
  auth,
  allowRoles(["superadmin", "admin"]),
  (req, res, next) => institutionController.getInstitution(req, res, next),
);

institutionRouter.patch(
  "/:institutionId",
  auth,
  allowRoles(["superadmin"]),
  (req, res, next) => institutionController.updateInstitution(req, res, next),
);

institutionRouter.delete(
  "/:institutionId",
  auth,
  allowRoles(["superadmin"]),
  (req, res, next) => institutionController.deleteInstitution(req, res, next),
);

export default institutionRouter;
