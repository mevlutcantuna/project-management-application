import { Request, Response, NextFunction } from "express";
import { verifyToken, extractTokenFromHeader } from "@/utils/jwt";
import { UnauthorizedError } from "@/utils/errors";
import { UserService } from "@/services/user";
import { db } from "@/config/dbClient";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const payload = verifyToken(token);
    if (!payload) {
      throw new UnauthorizedError("Invalid token");
    }

    // Verify user still exists
    const userService = new UserService(db);
    const user = await userService.getUserById(payload.id);

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    next();
  } catch (error) {
    next(error);
  }
};
