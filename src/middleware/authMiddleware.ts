import type { NextFunction, Request, Response } from "express";
import { ApplicationError } from "./errorHandler";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = req.session.user;
    
    if (!session) {
      throw new ApplicationError("Unauthorized", 401);
    }

    next();
  } catch (err) {
    next(err);
  }
};
