import { Request } from "express";
import { User, UserRole } from "./user";

export interface Workspace {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWorkspaceRequest extends Request {
  body: {
    title: string;
    description: string;
  };
}

export interface UpdateWorkspaceRequest extends Request {
  params: {
    id: string;
  };
}

export interface AddWorkspaceMemberRequest extends Request {
  params: {
    id: string;
  };
  body: {
    userId: string;
    role: UserRole;
  };
}

export interface SendWorkspaceInvitationRequest extends Request {
  params: {
    id: string;
  };
  body: {
    email: string;
    role: UserRole;
  };
}

export interface CreateWorkspaceInput {
  title: string;
  description: string;
  ownerId: string;
}

export interface UpdateWorkspaceInput extends Partial<CreateWorkspaceInput> {
  id: string;
}

export interface AddUserToWorkspaceInput {
  workspaceId: string;
  userId: string;
  role: UserRole;
}

export interface WorkspaceMember extends User {
  userId: string;
  role: UserRole;
}

export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  email: string;
  role: UserRole;
  invitedBy: string;
  expiresAt: Date;
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
