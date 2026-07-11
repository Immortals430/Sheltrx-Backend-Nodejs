import express from "express";
import WardenController from "./warden.controller.js";
import { allowRoles } from "@/middleware/allowRoles.js";
import { auth } from "@/middleware/authMiddleware.js";
const wardenRouter = express.Router();
const wardenController = new WardenController();

wardenRouter.get("/", auth, (req, res, next) =>
  wardenController.getWardens(req, res, next),
);

export default wardenRouter;
