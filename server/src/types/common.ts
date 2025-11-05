import { Request } from "express";
import { User } from "./user";

export interface AuthenticatedRequest extends Request {
  user: Omit<User, "passwordHash">;
}
