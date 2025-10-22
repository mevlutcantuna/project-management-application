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

export type CreateTeamInput = Omit<
  Team,
  "id" | "createdAt" | "updatedAt" | "users"
>;

export type UpdateTeamInput = Partial<CreateTeamInput>;
