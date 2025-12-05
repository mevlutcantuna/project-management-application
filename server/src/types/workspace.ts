import { Request } from "express";

export interface Workspace {
  id: string;
  name: string;
  description: string;
  ownerId: string;
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
    workspaceId: string;
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
