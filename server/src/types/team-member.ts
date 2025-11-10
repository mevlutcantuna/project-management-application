import { Request } from "express";
import { User, UserRole } from "./user";

export interface TeamMember
  extends Partial<Omit<User, "passwordHash" | "createdAt" | "updatedAt">> {
  id: string;
  teamId: string;
  userId: string;
  role: UserRole;
}

export interface AddUserToTeamRequest extends Request {
  body: {
    teamId: string;
    userId: string;
    role: UserRole;
  };
}

export interface DeleteTeamMemberRequest extends Request {
  params: {
    teamId: string;
    userId: string;
  };
}

export interface UpdateTeamMemberRoleRequest extends Request {
  params: {
    teamId: string;
    userId: string;
  };
  body: {
    role: UserRole;
  };
}

export interface RemoveUserFromTeamRequest extends Request {
  params: {
    teamId: string;
    userId: string;
  };
}
