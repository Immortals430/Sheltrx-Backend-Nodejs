import { prisma } from "@/config/prisma";
import type { NextFunction, Request, Response } from "express";

export const requireActiveTenant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const currentUser = req.session.user;

  if (!currentUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (currentUser.role !== "tenant") {
    next();
  }

  const tenant = await prisma.user.findUnique({
    where: { id: currentUser.userId },
  });

  if (!tenant) {
    return res.status(404).json({ message: "Tenant not found" });
  }

  if (tenant.flag) {
    return res.status(403).json({
      message: "Tenant operations are currently disabled",
    });
  }

  next();
};
