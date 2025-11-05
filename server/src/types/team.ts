import { Request } from "express";
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

export interface CreateTeamRequest extends Request {
  body: CreateTeamInput;
}

export interface UpdateTeamRequest extends Request {
  params: {
    id: string;
  };
  body: UpdateTeamInput;
}

export interface GetTeamsByWorkspaceRequest extends Request {
  query: {
    workspaceId: string;
  };
}

export interface GetTeamByIdRequest extends Request {
  params: {
    id: string;
  };
}

export interface DeleteTeamRequest extends Request {
  params: {
    id: string;
  };
}

export interface GetTeamByIdentifierRequest extends Request {
  params: {
    identifier: string;
    workspaceId: string;
  };
}
