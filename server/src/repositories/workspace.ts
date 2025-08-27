import Database from "@/config/db";
import camelcaseKeys from "camelcase-keys";
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

class WorkspaceRepository {
  constructor(private db: Database) {}

  async createWorkspace(input: CreateWorkspaceInput): Promise<Workspace> {
    const query = `
      INSERT INTO workspaces (title, description, owner_id)
      VALUES ($1, $2, $3)
      RETURNING id, title, description, owner_id, created_at, updated_at
    `;

    const values = [input.title, input.description, input.ownerId];

    const result = await this.db.query(query, values);
    return camelcaseKeys(result.rows[0]);
  }

  async getWorkspaceById(id: string): Promise<Workspace | null> {
    const query = `
      SELECT id, title, description, owner_id, created_at, updated_at
      FROM workspaces
      WHERE id = $1
    `;

    const result = await this.db.query(query, [id]);
    return result.rows[0] ? (camelcaseKeys(result.rows[0]) as Workspace) : null;
  }

  async getWorkspacesByUserId(userId: string): Promise<Workspace[]> {
    const query = `
      SELECT id, title, description, owner_id, created_at, updated_at
      FROM workspaces
      WHERE owner_id = $1
    `;

    const result = await this.db.query(query, [userId]);
    return camelcaseKeys(result.rows) as Workspace[];
  }

  async updateWorkspace(input: UpdateWorkspaceInput): Promise<Workspace> {
    const query = `
      UPDATE workspaces
      SET title = $1, description = $2, owner_id = $3
      WHERE id = $4
      RETURNING id, title, description, owner_id, created_at, updated_at
    `;

    const values = [
      input.title ?? null,
      input.description ?? null,
      input.ownerId ?? null,
      input.id,
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

  async updateUserRoleInWorkspace(
    workspaceId: string,
    userId: string,
    role: UserRole
  ): Promise<void> {
    const query = `
      UPDATE workspace_members
      SET role = $3
      WHERE workspace_id = $1 AND user_id = $2
    `;

    const values = [workspaceId, userId, role];
    await this.db.query(query, values);
  }

  async removeUserFromWorkspace(
    workspaceId: string,
    userId: string
  ): Promise<void> {
    const query = `
      DELETE FROM workspace_members
      WHERE workspace_id = $1 AND user_id = $2
    `;

    await this.db.query(query, [workspaceId, userId]);
  }

  // Workspace Members
  async addUserToWorkspaceMember(
    input: AddUserToWorkspaceInput
  ): Promise<void> {
    const query = `
      INSERT INTO workspace_members (workspace_id, user_id, role)
      VALUES ($1, $2, $3)
    `;

    await this.db.query(query, [input.workspaceId, input.userId, input.role]);
  }

  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    const query = `
      SELECT id, user_id, role
      FROM workspace_members
      WHERE workspace_id = $1
    `;

    const result = await this.db.query(query, [workspaceId]);
    return camelcaseKeys(result.rows);
  }

  async getWorkspaceMemberByUserId(
    userId: string
  ): Promise<WorkspaceMember | null> {
    const query = `
      SELECT id, user_id, role, email, full_name, profile_picture, created_at, updated_at
      FROM workspace_members
      JOIN users ON workspace_members.user_id = users.id
      WHERE user_id = $1
    `;

    const result = await this.db.query(query, [userId]);
    return result.rows[0]
      ? (camelcaseKeys(result.rows[0]) as WorkspaceMember)
      : null;
  }

  // Workspace Invitations
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
      RETURNING id, workspace_id, email, role, invited_by, expires_at
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

export default WorkspaceRepository;
