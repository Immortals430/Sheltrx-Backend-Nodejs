import type { NextFunction, Request, Response } from "express";

export const allowRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const currentUser = req.session.user;

    if (!currentUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(currentUser.role)) {
      return res
        .status(403)
        .json({ message: "You do not have permission to perform this action" });
    }
    next();
  };
};
