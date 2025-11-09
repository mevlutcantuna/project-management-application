import Database from "@/config/db";
import { CreateTeamInput, Team, UpdateTeamInput } from "@/types/team";
import camelcaseKeys from "camelcase-keys";

class TeamRepository {
  constructor(private db: Database) {}

  async createTeam(values: CreateTeamInput): Promise<Team> {
    const query = `
      INSERT INTO teams (name, identifier, workspace_id, icon_name, color, created_by_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, identifier, workspace_id, icon_name, color, created_at, updated_at, created_by_id
    `;

    const result = await this.db.query(query, [
      values.name,
      values.identifier,
      values.workspaceId,
      values.iconName,
      values.color,
      values.createdById,
    ]);
    return camelcaseKeys(result.rows[0]);
  }

  async updateTeam(id: string, values: UpdateTeamInput): Promise<Team> {
    const query = `
      UPDATE teams
      SET name = $1, identifier = $2, workspace_id = $3, icon_name = $4, color = $5
      WHERE id = $6
      RETURNING id, name, identifier, workspace_id, icon_name, color, created_at, updated_at
    `;

    const result = await this.db.query(query, [
      values.name,
      values.identifier,
      values.workspaceId,
      values.iconName,
      values.color,
      id,
    ]);
    return camelcaseKeys(result.rows[0]);
  }

  async deleteTeam(id: string): Promise<void> {
    const query = `
      DELETE FROM teams
      WHERE id = $1
    `;
    await this.db.query(query, [id]);
  }

  async getTeams(workspaceId: string): Promise<Team[]> {
    const query = `
      SELECT id, name, identifier, workspace_id, icon_name, color, created_at, updated_at, users
      FROM teams_with_members
      WHERE workspace_id = $1
    `;

    const result = await this.db.query(query, [workspaceId]);
    return camelcaseKeys(result.rows, { deep: true }) as Team[];
  }

  async getTeamById(id: string): Promise<Team | null> {
    const query = `
      SELECT id, name, identifier, workspace_id, icon_name, color, created_at, updated_at, users
      FROM teams_with_members
      WHERE id = $1 
    `;
    const result = await this.db.query(query, [id]);
    return result.rows[0]
      ? (camelcaseKeys(result.rows[0], { deep: true }) as Team)
      : null;
  }

  async getTeamByIdentifier(
    identifier: string,
    workspaceId: string
  ): Promise<Team | null> {
    const query = `
      SELECT id, name, identifier, workspace_id, icon_name, color, created_at, updated_at, users
      FROM teams_with_members
      WHERE identifier = $1 AND workspace_id = $2
    `;
    const result = await this.db.query(query, [identifier, workspaceId]);
    console.log(result.rows[0]);
    return result.rows[0]
      ? (camelcaseKeys(result.rows[0], { deep: true }) as Team)
      : null;
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

  async checkUserIsTeamMemberWithTeamIdentifier(
    userId: string,
    identifier: string,
    workspaceId: string
  ): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as count
      FROM teams
      LEFT JOIN team_members ON teams.id = team_members.team_id
      WHERE team_members.user_id = $1 AND teams.identifier = $2 AND teams.workspace_id = $3
    `;
    const result = await this.db.query(query, [
      userId,
      identifier,
      workspaceId,
    ]);
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

  async checkTeamIdentifierExistsForWorkspace(
    workspaceId: string,
    identifier: string
  ): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as count
      FROM teams
      WHERE workspace_id = $1 AND identifier = $2 
    `;

    const result = await this.db.query(query, [workspaceId, identifier]);
    return parseInt(result.rows[0].count) > 0;
  }

  async checkTeamIdentifierExistsForWorkspaceExceptCurrentTeam(
    workspaceId: string,
    identifier: string,
    currentTeamId: string
  ): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as count
      FROM teams
      WHERE workspace_id = $1 AND identifier = $2 AND id != $3
    `;
    const result = await this.db.query(query, [
      workspaceId,
      identifier,
      currentTeamId,
    ]);
    return parseInt(result.rows[0].count) > 0;
  }
}

export default TeamRepository;
