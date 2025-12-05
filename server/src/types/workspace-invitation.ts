import { Request } from "express";
import { UserRole } from "./user";

export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  email: string;
  role: UserRole;
  invitedBy: string;
  expiresAt: Date;
}

export interface SendWorkspaceInvitationRequest extends Request {
  params: {
    workspaceId: string;
  };
  body: {
    email: string;
    role: UserRole;
  };
}

export interface CreateWorkspaceInvitationInput {
  workspaceId: string;
  email: string;
  role: UserRole;
  invitedBy: string;
}

export interface UpdateWorkspaceInvitationInput {
  role: UserRole;
}
