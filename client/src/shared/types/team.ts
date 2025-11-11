import type { User, UserRole } from "./user";

export interface Team {
  id: string;
  name: string;
  identifier: string;
  workspaceId: string;
  iconName: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  users: (Omit<User, "createdAt" | "updatedAt"> & { role: UserRole })[];
}

export interface CreateTeamInput {
  workspaceId: string;
  name: string;
  identifier: string;
  iconName: string;
  color: string;
  userIds?: string[];
}

export interface UpdateTeamInput extends Partial<CreateTeamInput> {
  id: string;
  workspaceId: string;
}

export interface RemoveUserFromTeamInput {
  workspaceId: string;
  teamId: string;
  userId: string;
}

export interface LeaveTeamInput {
  workspaceId: string;
  teamId: string;
}

export interface AddUserToTeamInput {
  workspaceId: string;
  teamId: string;
  email: string;
  role?: UserRole;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: UserRole;
  user: Omit<User, "createdAt" | "updatedAt">;
}
