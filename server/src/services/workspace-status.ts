import Database from "@/config/db";
import {
  WorkspaceStatus,
  CreateWorkspaceStatusInput,
  UpdateWorkspaceStatusInput,
} from "@/types/workspace-status";
import WorkspaceStatusRepository from "@/repositories/workspace-status";

export class WorkspaceStatusService {
  private workspaceStatusRepository: WorkspaceStatusRepository;

  constructor(private db: Database) {
    this.workspaceStatusRepository = new WorkspaceStatusRepository(db);
  }

  async getWorkspaceStatuses(workspaceId: string): Promise<WorkspaceStatus[]> {
    return this.workspaceStatusRepository.getWorkspaceStatuses(workspaceId);
  }

  async getWorkspaceStatusById(id: string): Promise<WorkspaceStatus | null> {
    return this.workspaceStatusRepository.getWorkspaceStatusById(id);
  }

  async createWorkspaceStatus(
    input: CreateWorkspaceStatusInput
  ): Promise<WorkspaceStatus> {
    return this.workspaceStatusRepository.createWorkspaceStatus(input);
  }

  async updateWorkspaceStatus(
    input: UpdateWorkspaceStatusInput
  ): Promise<WorkspaceStatus> {
    return this.workspaceStatusRepository.updateWorkspaceStatus(input);
  }

  async deleteWorkspaceStatus(id: string): Promise<void> {
    return this.workspaceStatusRepository.deleteWorkspaceStatus(id);
  }
}
