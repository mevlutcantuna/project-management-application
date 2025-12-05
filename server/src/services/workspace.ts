import Database from "@/config/db";
import {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  Workspace,
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
}
