import Database from "@/config/db";
import camelcaseKeys from "camelcase-keys";
import {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  Workspace,
} from "@/types/workspace";

class WorkspaceRepository {
  constructor(private db: Database) {}

  async createWorkspace(input: CreateWorkspaceInput): Promise<Workspace> {
    const query = `
      INSERT INTO workspaces (name, description, owner_id, url)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, description, owner_id, created_at, updated_at, url
    `;

    const values = [input.name, input.description, input.ownerId, input.url];

    const result = await this.db.query(query, values);
    return camelcaseKeys(result.rows[0]);
  }

  async getWorkspaceById(id: string): Promise<Workspace | null> {
    const query = `
      SELECT id, name, description, owner_id, created_at, updated_at, url
      FROM workspaces
      WHERE id = $1
    `;

    const result = await this.db.query(query, [id]);
    return result.rows[0] ? (camelcaseKeys(result.rows[0]) as Workspace) : null;
  }

  async getWorkspaceByUrl(url: string): Promise<Workspace | null> {
    const query = `
      SELECT id, name, description, owner_id, created_at, updated_at, url
      FROM workspaces
      WHERE url = $1
    `;

    const result = await this.db.query(query, [url]);
    return result.rows[0] ? (camelcaseKeys(result.rows[0]) as Workspace) : null;
  }

  async getWorkspacesByUserId(userId: string): Promise<Workspace[]> {
    const query = `
      SELECT workspaces.id as id, name, description, owner_id, created_at, updated_at, url
      FROM workspaces
      LEFT JOIN workspace_members ON workspaces.id = workspace_members.workspace_id
      WHERE workspace_members.user_id = $1
    `;

    const result = await this.db.query(query, [userId]);
    return camelcaseKeys(result.rows) as Workspace[];
  }

  async getWorkspaceByName(name: string): Promise<Workspace | null> {
    const query = `
      SELECT id, name, description, owner_id, created_at, updated_at, url
      FROM workspaces
      WHERE name = $1
    `;
    const result = await this.db.query(query, [name]);
    return result.rows[0] ? (camelcaseKeys(result.rows[0]) as Workspace) : null;
  }

  async updateWorkspace(input: UpdateWorkspaceInput): Promise<Workspace> {
    const query = `
      UPDATE workspaces
      SET name = $1, description = $2, owner_id = $3, url = $4
      WHERE id = $4
      RETURNING id, name, description, owner_id, created_at, updated_at, url
    `;

    const values = [
      input.name ?? null,
      input.description ?? null,
      input.ownerId ?? null,
      input.id,
      input.url ?? null,
    ];

    const result = await this.db.query(query, values);
    return camelcaseKeys(result.rows[0]);
  }

  async deleteWorkspace(id: string): Promise<void> {
    const query = `
      DELETE FROM workspace_members WHERE workspace_id = $1; 
      DELETE FROM workspaces WHERE id = $1;
      DELETE FROM workspace_invitations WHERE workspace_id = $1;
    `;

    await this.db.query(query, [id]);
  }
}

export default WorkspaceRepository;
