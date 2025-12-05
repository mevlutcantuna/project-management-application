import Database from "@/config/db";
import camelcaseKeys from "camelcase-keys";
import {
  WorkspaceStatus,
  CreateWorkspaceStatusInput,
  UpdateWorkspaceStatusInput,
} from "@/types/workspace-status";

class WorkspaceStatusRepository {
  constructor(private db: Database) {}

  async getWorkspaceStatuses(workspaceId: string): Promise<WorkspaceStatus[]> {
    const query = `
      SELECT id, workspace_id, name, icon_name, color, created_at, updated_at
      FROM workspace_statuses
      WHERE workspace_id = $1
    `;
    const result = await this.db.query(query, [workspaceId]);
    return camelcaseKeys(result.rows);
  }

  async getWorkspaceStatusById(id: string): Promise<WorkspaceStatus | null> {
    const query = `
      SELECT id, workspace_id, name, icon_name, color, created_at, updated_at
      FROM workspace_statuses
      WHERE id = $1
    `;
    const result = await this.db.query(query, [id]);
    return result.rows[0] ? camelcaseKeys(result.rows[0]) : null;
  }

  async createWorkspaceStatus(
    input: CreateWorkspaceStatusInput
  ): Promise<WorkspaceStatus> {
    const query = `
      INSERT INTO workspace_statuses (workspace_id, name, icon_name, color, created_by_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, workspace_id, name, icon_name, color, created_at, updated_at
    `;

    const values = [
      input.workspaceId,
      input.name,
      input.iconName,
      input.color,
      input.createdById,
    ];
    const result = await this.db.query(query, values);
    return camelcaseKeys(result.rows[0]);
  }

  async updateWorkspaceStatus(
    input: UpdateWorkspaceStatusInput
  ): Promise<WorkspaceStatus> {
    const query = `
      UPDATE workspace_statuses
      SET name = $1, icon_name = $2, color = $3
      WHERE id = $4
      RETURNING id, workspace_id, name, icon_name, color, created_at, updated_at
    `;

    const values = [
      input.name ?? null,
      input.iconName ?? null,
      input.color ?? null,
      input.id,
    ];
    const result = await this.db.query(query, values);
    return camelcaseKeys(result.rows[0]);
  }

  async deleteWorkspaceStatus(id: string): Promise<void> {
    const query = `
      DELETE FROM workspace_statuses
      WHERE id = $1
    `;

    await this.db.query(query, [id]);
  }
}

export default WorkspaceStatusRepository;
