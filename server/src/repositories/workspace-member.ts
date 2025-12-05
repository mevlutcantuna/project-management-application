import Database from "@/config/db";
import camelcaseKeys from "camelcase-keys";
import { UserRole } from "@/types/user";
import {
  WorkspaceMember,
  AddUserToWorkspaceInput,
} from "@/types/workspace-member";

class WorkspaceMemberRepository {
  constructor(private db: Database) {}

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
    userId: string,
    workspaceId: string
  ): Promise<WorkspaceMember | null> {
    const query = `
      SELECT workspace_members.id, user_id, role, email, first_name, last_name, profile_picture, created_at, updated_at
      FROM workspace_members
      JOIN users ON workspace_members.user_id = users.id
      WHERE user_id = $1 AND workspace_id = $2
    `;

    const result = await this.db.query(query, [userId, workspaceId]);
    return result.rows[0]
      ? (camelcaseKeys(result.rows[0]) as WorkspaceMember)
      : null;
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

  async checkUserIsWorkspaceMember(
    userId: string,
    workspaceId: string
  ): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as count
      FROM workspace_members
      WHERE user_id = $1 AND workspace_id = $2
    `;
    const result = await this.db.query(query, [userId, workspaceId]);
    return parseInt(result.rows[0].count) > 0;
  }

  async checkUserIsWorkspaceAdminOrManager(
    userId: string,
    workspaceId: string
  ): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as count
      FROM workspace_members
      WHERE user_id = $1 AND workspace_id = $2 AND (role = 'Admin' OR role = 'Manager')
    `;
    const result = await this.db.query(query, [userId, workspaceId]);
    return parseInt(result.rows[0].count) > 0;
  }
}

export default WorkspaceMemberRepository;
