import type { NextFunction, Request, Response } from "express";
import { Prisma } from "generated/prisma/client";
import { ZodError } from "zod";

export class ApplicationError extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}

const errorhandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {


  // zod form validation error
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));

    return res.status(400).json({
      message: "Validation failed",
      errorType: "VALIDATION_ERROR",
      errors: formattedErrors,
    });
  }

  // custom errors
  if (err instanceof ApplicationError) {
    return res.status(err.code).send({ message: err.message });
  }

  // server errors.
  console.log("erro details", err);
  res.status(500).json({
    success: false,
    message: "Something went wrong, Please try again later",
  });
};

export default errorhandler;
