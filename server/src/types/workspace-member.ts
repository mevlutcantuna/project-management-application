import { Request } from "express";
import { User, UserRole } from "./user";

export interface WorkspaceMember extends User {
  userId: string;
  role: UserRole;
}

export interface AddWorkspaceMemberRequest extends Request {
  params: {
    workspaceId: string;
  };
  body: {
    userId: string;
    role: UserRole;
  };
}

export interface AddUserToWorkspaceInput {
  workspaceId: string;
  userId: string;
  role: UserRole;
}
