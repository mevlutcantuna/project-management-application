import type { User } from "./user";

export interface Team {
  id: string;
  name: string;
  identifier: string;
  workspaceId: string;
  iconName: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  users: Omit<User, "createdAt" | "updatedAt">[];
}

export interface CreateTeamInput {
  workspaceId: string;
  name: string;
  identifier: string;
  iconName: string;
  color: string;
  userIds?: string[];
}

export type UpdateTeamInput = Partial<CreateTeamInput>;
