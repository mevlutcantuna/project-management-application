import { AuthenticatedRequest } from "./common";
import { User, UserRole } from "./user";

export interface TeamMember
  extends Partial<Omit<User, "passwordHash" | "createdAt" | "updatedAt">> {
  id: string;
  teamId: string;
  userId: string;
  role: UserRole;
}

export interface AddUserToTeamRequest extends AuthenticatedRequest {
  body: {
    teamId: string;
    userId: string;
    role: UserRole;
  };
}

export interface DeleteTeamMemberRequest extends AuthenticatedRequest {
  params: {
    teamId: string;
    userId: string;
  };
}

export interface UpdateTeamMemberRoleRequest extends AuthenticatedRequest {
  params: {
    teamId: string;
    userId: string;
  };
  body: {
    role: UserRole;
  };
}
