import Database from "@/config/db";
import { UserRole } from "@/types/user";
import {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  Workspace,
  WorkspaceMember,
  WorkspaceInvitation,
  CreateWorkspaceInvitationInput,
  UpdateWorkspaceInvitationInput,
  AddUserToWorkspaceInput,
} from "@/types/workspace";
import WorkspaceRepository from "@/repositories/workspace";

export class WorkspaceService {
  private workspaceRepository: WorkspaceRepository;

  constructor(private db: Database) {
    this.workspaceRepository = new WorkspaceRepository(db);
  }

  async createWorkspace(input: CreateWorkspaceInput): Promise<Workspace> {
    return this.workspaceRepository.createWorkspace(input);
  }

  async getWorkspaceById(id: string): Promise<Workspace | null> {
    return this.workspaceRepository.getWorkspaceById(id);
  }

  async getWorkspaceByUrl(url: string): Promise<Workspace | null> {
    return this.workspaceRepository.getWorkspaceByUrl(url);
  }

  async getWorkspacesByUserId(userId: string): Promise<Workspace[]> {
    return this.workspaceRepository.getWorkspacesByUserId(userId);
  }

  async getWorkspaceByName(name: string): Promise<Workspace | null> {
    return this.workspaceRepository.getWorkspaceByName(name);
  }

  async updateWorkspace(input: UpdateWorkspaceInput): Promise<Workspace> {
    return this.workspaceRepository.updateWorkspace(input);
  }

  async deleteWorkspace(id: string): Promise<void> {
    return this.workspaceRepository.deleteWorkspace(id);
  }

  async updateUserRoleInWorkspace(
    workspaceId: string,
    userId: string,
    role: UserRole
  ): Promise<void> {
    return this.workspaceRepository.updateUserRoleInWorkspace(
      workspaceId,
      userId,
      role
    );
  }

  async removeUserFromWorkspace(
    workspaceId: string,
    userId: string
  ): Promise<void> {
    return this.workspaceRepository.removeUserFromWorkspace(
      workspaceId,
      userId
    );
  }

  // Workspace Members
  async addUserToWorkspaceMember(
    input: AddUserToWorkspaceInput
  ): Promise<void> {
    return this.workspaceRepository.addUserToWorkspaceMember(input);
  }

  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    return this.workspaceRepository.getWorkspaceMembers(workspaceId);
  }

  async getWorkspaceMemberByUserId(
    userId: string,
    workspaceId: string
  ): Promise<WorkspaceMember | null> {
    return this.workspaceRepository.getWorkspaceMemberByUserId(
      userId,
      workspaceId
    );
  }

  // Workspace Invitations
  async getWorkspaceInvitationById(
    id: string
  ): Promise<WorkspaceInvitation | null> {
    return this.workspaceRepository.getWorkspaceInvitationById(id);
  }

  async getWorkspaceInvitationsByWorkspaceId(
    workspaceId: string
  ): Promise<WorkspaceInvitation[]> {
    return this.workspaceRepository.getWorkspaceInvitationsByWorkspaceId(
      workspaceId
    );
  }

  async getWorkspaceInvitationsByEmail(
    email: string
  ): Promise<WorkspaceInvitation[]> {
    return this.workspaceRepository.getWorkspaceInvitationsByEmail(email);
  }

  async createWorkspaceInvitation(
    input: CreateWorkspaceInvitationInput
  ): Promise<WorkspaceInvitation> {
    return this.workspaceRepository.createWorkspaceInvitation(input);
  }

  async deleteWorkspaceInvitation(id: string): Promise<void> {
    return this.workspaceRepository.deleteWorkspaceInvitation(id);
  }

  async updateWorkspaceInvitation(
    id: string,
    input: UpdateWorkspaceInvitationInput
  ): Promise<WorkspaceInvitation> {
    return this.workspaceRepository.updateWorkspaceInvitation(id, input);
  }

  async isWorkspaceInvitationExpired(id: string): Promise<boolean> {
    return this.workspaceRepository.isWorkspaceInvitationExpired(id);
  }
}
