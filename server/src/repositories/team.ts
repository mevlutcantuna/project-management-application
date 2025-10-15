import Database from "@/config/db";
import { CreateTeamInput, Team, UpdateTeamInput } from "@/types/team";
import camelcaseKeys from "camelcase-keys";

class TeamRepository {
  constructor(private db: Database) {}

  async createTeam(values: CreateTeamInput): Promise<Team> {
    const query = `
      INSERT INTO teams (name, description, workspace_id, icon_name, color)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, description, workspace_id, icon_name, color, created_at, updated_at
    `;

    const result = await this.db.query(query, [
      values.name,
      values.description,
      values.workspaceId,
      values.iconName,
      values.color,
    ]);
    return camelcaseKeys(result.rows[0]);
  }

  async updateTeam(id: string, values: UpdateTeamInput): Promise<Team> {
    const query = `
      UPDATE teams
      SET name = $1, description = $2, workspace_id = $3, icon_name = $4, color = $5
      WHERE id = $6
      RETURNING id, name, description, workspace_id, icon_name, color, created_at, updated_at
    `;

    const result = await this.db.query(query, [
      values.name,
      values.description,
      values.workspaceId,
      values.iconName,
      values.color,
      id,
    ]);
    return camelcaseKeys(result.rows[0]);
  }

  async getTeams(workspaceId: string): Promise<Team[]> {
    const query = `
      SELECT id, name, description, workspace_id, icon_name, color, created_at, updated_at, users
      FROM teams_with_members
      WHERE workspace_id = $1
    `;

    const result = await this.db.query(query, [workspaceId]);
    return camelcaseKeys(result.rows);
  }

  async getTeamById(id: string): Promise<Team | null> {
    const query = `
      SELECT id, name, description, workspace_id, icon_name, color, created_at, updated_at, users
      FROM teams_with_members
      WHERE id = $1 
    `;
    const result = await this.db.query(query, [id]);
    return result.rows[0] ? (camelcaseKeys(result.rows[0]) as Team) : null;
  }

  async deleteTeam(id: string): Promise<void> {
    const query = `
      DELETE FROM teams
      WHERE id = $1
    `;
    await this.db.query(query, [id]);
  }

  async checkUserIsTeamMember(
    userId: string,
    teamId: string
  ): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as count
      FROM team_members
      WHERE user_id = $1 AND team_id = $2
    `;
    const result = await this.db.query(query, [userId, teamId]);
    return parseInt(result.rows[0].count) > 0;
  }

  async checkUserIsTeamAdminOrManager(
    userId: string,
    teamId: string
  ): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as count
      FROM team_members
      WHERE user_id = $1 AND team_id = $2 AND (role = 'Admin' OR role = 'Manager')
      `;
    const result = await this.db.query(query, [userId, teamId]);
    return parseInt(result.rows[0].count) > 0;
  }
}

export default TeamRepository;
