import { Request } from "express";
import { User, UserRole } from "./user";

export interface Workspace {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceStatus {
  id: string;
  workspaceId: string;
  name: string;
  iconName: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWorkspaceRequest extends Request {
  body: {
    name: string;
    description: string;
    url: string;
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
  name: string;
  description: string;
  ownerId: string;
  url: string;
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

export interface CreateWorkspaceStatusInput {
  workspaceId: string;
  name: string;
  iconName: string;
  color: string;
  createdById: string;
}

export interface UpdateWorkspaceStatusInput
  extends Partial<CreateWorkspaceStatusInput> {
  id: string;
}

export interface DeleteWorkspaceStatusInput {
  id: string;
}
