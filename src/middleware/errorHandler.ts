import type { NextFunction, Request, Response } from "express";
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
  // mongoose validation error
  //   if (err instanceof mongoose.Error.ValidationError) {
  //     console.log("mongoose class error", err);
  //     return res.status(400).send(err.message);
  //   }

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
