import Database from "@/config/db";
import {
  WorkspaceInvitation,
  CreateWorkspaceInvitationInput,
  UpdateWorkspaceInvitationInput,
} from "@/types/workspace-invitation";
import WorkspaceInvitationRepository from "@/repositories/workspace-invitation";

export class WorkspaceInvitationService {
  private workspaceInvitationRepository: WorkspaceInvitationRepository;

  constructor(private db: Database) {
    this.workspaceInvitationRepository = new WorkspaceInvitationRepository(db);
  }

  async getWorkspaceInvitationById(
    id: string
  ): Promise<WorkspaceInvitation | null> {
    return this.workspaceInvitationRepository.getWorkspaceInvitationById(id);
  }

  async getWorkspaceInvitationsByWorkspaceId(
    workspaceId: string
  ): Promise<WorkspaceInvitation[]> {
    return this.workspaceInvitationRepository.getWorkspaceInvitationsByWorkspaceId(
      workspaceId
    );
  }

  async getWorkspaceInvitationsByEmail(
    email: string
  ): Promise<WorkspaceInvitation[]> {
    return this.workspaceInvitationRepository.getWorkspaceInvitationsByEmail(
      email
    );
  }

  async createWorkspaceInvitation(
    input: CreateWorkspaceInvitationInput
  ): Promise<WorkspaceInvitation> {
    return this.workspaceInvitationRepository.createWorkspaceInvitation(input);
  }

  async deleteWorkspaceInvitation(id: string): Promise<void> {
    return this.workspaceInvitationRepository.deleteWorkspaceInvitation(id);
  }

  async updateWorkspaceInvitation(
    id: string,
    input: UpdateWorkspaceInvitationInput
  ): Promise<WorkspaceInvitation> {
    return this.workspaceInvitationRepository.updateWorkspaceInvitation(
      id,
      input
    );
  }

  async isWorkspaceInvitationExpired(id: string): Promise<boolean> {
    return this.workspaceInvitationRepository.isWorkspaceInvitationExpired(id);
  }
}
