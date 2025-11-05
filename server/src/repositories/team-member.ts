import Database from "@/config/db";
import { TeamMember } from "@/types/team-member";
import { UserRole } from "@/types/user";
import { NotFoundError } from "@/utils/errors";
import camelcaseKeys from "camelcase-keys";

class TeamMemberRepository {
  constructor(private db: Database) {}

  async addUserToTeam(
    teamId: string,
    userId: string,
    role: UserRole
  ): Promise<TeamMember> {
    const query = `
      WITH inserted_member AS (
        INSERT INTO team_members (team_id, user_id, role)
        VALUES ($1, $2, $3)
        RETURNING id
      )
      SELECT *
      FROM team_members_with_user_details
      WHERE id = (SELECT id FROM inserted_member)
    `;

    const result = await this.db.query(query, [teamId, userId, role]);

    if (!result.rows.length) {
      throw new NotFoundError("User or team not found");
    }

    return camelcaseKeys(result.rows[0]) as TeamMember;
  }

  async deleteTeamMember(teamId: string, userId: string): Promise<void> {
    const query = `
      DELETE FROM team_members
      WHERE team_id = $1 AND user_id = $2
    `;
    await this.db.query(query, [teamId, userId]);
  }

  async updateTeamMemberRole(
    teamId: string,
    userId: string,
    role: UserRole
  ): Promise<TeamMember> {
    const query = `
      WITH updated_member AS (
        UPDATE team_members
        SET role = $3
        WHERE team_id = $1 AND user_id = $2
        RETURNING id
      )
      SELECT *
      FROM team_members_with_user_details
      WHERE id = (SELECT id FROM updated_member)
    `;

    const result = await this.db.query(query, [teamId, userId, role]);

    if (!result.rows.length) {
      throw new NotFoundError("Team member not found");
    }

    return camelcaseKeys(result.rows[0]) as TeamMember;
  }
}

export default TeamMemberRepository;
