export interface Workspace {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
}
