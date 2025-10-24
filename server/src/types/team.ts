import { AuthenticatedRequest } from "./common";
import { User } from "./user";

export interface Team {
  id: string;
  workspaceId: string;
  name: string;
  identifier: string;
  iconName: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  users: Omit<User, "createdAt" | "updatedAt" | "passwordHash">[];
}

export interface CreateTeamInput {
  workspaceId: string;
  name: string;
  identifier: string;
  iconName: string;
  color: string;
  userIds?: string[];
  createdById: string;
}

export type UpdateTeamInput = Partial<CreateTeamInput>;

export interface CreateTeamRequest extends AuthenticatedRequest {
  body: CreateTeamInput;
}

export interface UpdateTeamRequest extends AuthenticatedRequest {
  params: {
    id: string;
  };
  body: UpdateTeamInput;
}

export interface GetTeamsByWorkspaceRequest extends AuthenticatedRequest {
  query: {
    workspaceId: string;
  };
}

export interface GetTeamByIdRequest extends AuthenticatedRequest {
  params: {
    id: string;
  };
}

export interface DeleteTeamRequest extends AuthenticatedRequest {
  params: {
    id: string;
  };
}

export interface GetTeamByIdentifierRequest extends AuthenticatedRequest {
  params: {
    identifier: string;
    workspaceId: string;
  };
}
