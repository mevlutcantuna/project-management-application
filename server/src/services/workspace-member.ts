import Database from "@/config/db";
import { UserRole } from "@/types/user";
import {
  WorkspaceMember,
  AddUserToWorkspaceInput,
} from "@/types/workspace-member";
import WorkspaceMemberRepository from "@/repositories/workspace-member";

export class WorkspaceMemberService {
  private workspaceMemberRepository: WorkspaceMemberRepository;

  constructor(private db: Database) {
    this.workspaceMemberRepository = new WorkspaceMemberRepository(db);
  }

  async addUserToWorkspaceMember(
    input: AddUserToWorkspaceInput
  ): Promise<void> {
    return this.workspaceMemberRepository.addUserToWorkspaceMember(input);
  }

  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    return this.workspaceMemberRepository.getWorkspaceMembers(workspaceId);
  }

  async getWorkspaceMemberByUserId(
    userId: string,
    workspaceId: string
  ): Promise<WorkspaceMember | null> {
    return this.workspaceMemberRepository.getWorkspaceMemberByUserId(
      userId,
      workspaceId
    );
  }

  async updateUserRoleInWorkspace(
    workspaceId: string,
    userId: string,
    role: UserRole
  ): Promise<void> {
    return this.workspaceMemberRepository.updateUserRoleInWorkspace(
      workspaceId,
      userId,
      role
    );
  }

  async removeUserFromWorkspace(
    workspaceId: string,
    userId: string
  ): Promise<void> {
    return this.workspaceMemberRepository.removeUserFromWorkspace(
      workspaceId,
      userId
    );
  }

  async checkUserIsWorkspaceMember(
    userId: string,
    workspaceId: string
  ): Promise<boolean> {
    return this.workspaceMemberRepository.checkUserIsWorkspaceMember(
      userId,
      workspaceId
    );
  }

  async checkUserIsWorkspaceAdminOrManager(
    userId: string,
    workspaceId: string
  ): Promise<boolean> {
    return this.workspaceMemberRepository.checkUserIsWorkspaceAdminOrManager(
      userId,
      workspaceId
    );
  }
}
