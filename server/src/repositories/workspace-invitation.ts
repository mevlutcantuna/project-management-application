import Database from "@/config/db";
import camelcaseKeys from "camelcase-keys";
import {
  WorkspaceInvitation,
  CreateWorkspaceInvitationInput,
  UpdateWorkspaceInvitationInput,
} from "@/types/workspace-invitation";

class WorkspaceInvitationRepository {
  constructor(private db: Database) {}

  async getWorkspaceInvitationById(
    id: string
  ): Promise<WorkspaceInvitation | null> {
    const query = `
      SELECT id, workspace_id, email, role, invited_by, expires_at
      FROM workspace_invitations
      WHERE id = $1
    `;

    const result = await this.db.query(query, [id]);
    return result.rows[0] ? camelcaseKeys(result.rows[0]) : null;
  }

  async getWorkspaceInvitationsByWorkspaceId(
    workspaceId: string
  ): Promise<WorkspaceInvitation[]> {
    const query = `
      SELECT id, workspace_id, email, role, invited_by, expires_at
      FROM workspace_invitations
      WHERE workspace_id = $1
    `;

    const result = await this.db.query(query, [workspaceId]);
    return camelcaseKeys(result.rows);
  }

  async getWorkspaceInvitationsByEmail(
    email: string
  ): Promise<WorkspaceInvitation[]> {
    const query = `
      SELECT id, workspace_id, email, role, invited_by, expires_at
      FROM workspace_invitations
      WHERE email = $1
    `;

    const result = await this.db.query(query, [email]);
    return camelcaseKeys(result.rows);
  }

  async createWorkspaceInvitation(
    input: CreateWorkspaceInvitationInput
  ): Promise<WorkspaceInvitation> {
    const query = `
      INSERT INTO workspace_invitations (workspace_id, email, role, invited_by)
      VALUES ($1, $2, $3, $4)
      RETURNING id, workspace_id, email, role, invited_by, expires_at, url
    `;

    const values = [
      input.workspaceId,
      input.email,
      input.role,
      input.invitedBy,
    ];

    const result = await this.db.query(query, values);
    return camelcaseKeys(result.rows[0]);
  }

  async deleteWorkspaceInvitation(id: string): Promise<void> {
    const query = `
      DELETE FROM workspace_invitations
      WHERE id = $1
    `;

    await this.db.query(query, [id]);
  }

  async updateWorkspaceInvitation(
    id: string,
    input: UpdateWorkspaceInvitationInput
  ): Promise<WorkspaceInvitation> {
    const query = `
      UPDATE workspace_invitations
      SET role = $2
      WHERE id = $1
      RETURNING id, workspace_id, email, role, invited_by, expires_at
    `;

    const values = [id, input.role];

    const result = await this.db.query(query, values);
    return camelcaseKeys(result.rows[0]);
  }

  async isWorkspaceInvitationExpired(id: string): Promise<boolean> {
    const query = `
      SELECT expires_at
      FROM workspace_invitations
      WHERE id = $1
    `;

    const result = await this.db.query(query, [id]);
    const row = camelcaseKeys(result.rows[0]);
    return row.expiresAt < new Date();
  }
}

export default WorkspaceInvitationRepository;
