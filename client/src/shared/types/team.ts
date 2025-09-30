import type { User } from "./user";

export interface Team {
  id: string;
  name: string;
  description: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
  users: Omit<User, "createdAt" | "updatedAt">[];
}
