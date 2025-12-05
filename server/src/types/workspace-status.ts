export interface WorkspaceStatus {
  id: string;
  workspaceId: string;
  name: string;
  iconName: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
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
