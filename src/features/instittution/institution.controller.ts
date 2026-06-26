import type { NextFunction, Request, Response } from "express";
import {
  createInstitution,
  institutionQueries,
  updateInstitution,
} from "./institution.validatior";
import InstitutionService from "./institution.service";
import { ApplicationError } from "@/middleware/errorHandler";

export default class InstitutionController {
  institutionService;
  constructor() {
    this.institutionService = new InstitutionService();
  }

  // create institution
  async createInstitution(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = createInstitution.parse(req.body);

      const institution =
        await this.institutionService.createInstitution(payload);

      res.status(201).json({
        message: "Institution created successfully",
        data: institution,
      });
    } catch (error) {
      next(error);
    }
  }

  // get institution
  async getInstitution(req: Request, res: Response, next: NextFunction) {
    try {
      const queries = institutionQueries.parse(req.query);
      const currentUser = req.session.user;
      
      if (!currentUser) {
        throw new ApplicationError("User not found", 404);
      }

      const institution = await this.institutionService.getInstitution(
        currentUser,
        queries,
      );

      res.status(200).json({
        data: institution,
      });
    } catch (error) {
      next(error);
    }
  }

  // get institution detail
  async getInstitutionDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { institutionId } = req.params;

      if (!institutionId || typeof institutionId !== "string") {
        throw new ApplicationError("Institution id is required", 400);
      }

      const institution =
        await this.institutionService.getInstitutionDetail(institutionId);

      res.status(200).json({
        data: institution,
      });
    } catch (error) {
      next(error);
    }
  }

  // update institution
  async updateInstitution(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = updateInstitution.parse(req.body);
      const { institutionId } = req.params;

      if (!institutionId || typeof institutionId !== "string") {
        throw new ApplicationError("Institution id is required", 400);
      }

      const institution = await this.institutionService.updateInstitution(
        institutionId,
        payload,
      );

      res.status(201).json({
        message: "Institution updated successfully",
        data: institution,
      });
    } catch (error) {
      next(error);
    }
  }

  // delete institution
  async deleteInstitution(req: Request, res: Response, next: NextFunction) {
    try {
      const { institutionId } = req.params;

      if (!institutionId || typeof institutionId !== "string") {
        throw new ApplicationError("Institution id is required", 400);
      }

      const institution =
        await this.institutionService.deleteInstitution(institutionId);

      res.status(201).json({
        message: "Institution deleted successfully",
        data: institution,
      });
    } catch (error) {
      next(error);
    }
  }
}
