import { User } from "../user";
import { Workspace } from "../workspace";

declare global {
  namespace Express {
    export interface Request {
      user: Omit<User, "passwordHash">;
      workspace?: Workspace;
    }
  }
}
