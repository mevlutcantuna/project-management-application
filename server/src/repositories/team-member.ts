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
    role?: UserRole
  ): Promise<TeamMember> {
    const query = `
    INSERT INTO team_members (team_id, user_id, role)
    VALUES ($1, $2, $3)
    RETURNING 
      id,
      team_id,
      role,
      user_id,
      json_build_object(
        'id', (SELECT id FROM users WHERE id = $2),
        'first_name', (SELECT first_name FROM users WHERE id = $2),
        'last_name', (SELECT last_name FROM users WHERE id = $2),
        'email', (SELECT email FROM users WHERE id = $2),
        'profile_picture', (SELECT profile_picture FROM users WHERE id = $2)
      ) as user
  `;

    const result = await this.db.query(query, [
      teamId,
      userId,
      role ?? "Member",
    ]);

    if (!result.rows.length) {
      throw new NotFoundError("User or team not found");
    }

    return camelcaseKeys(result.rows[0], { deep: true }) as TeamMember;
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
    UPDATE team_members 
    SET role = $3
    WHERE team_id = $1 AND user_id = $2
    RETURNING 
      id,
      team_id,
      role,
      user_id,
      json_build_object(
        'id', (SELECT id FROM users WHERE id = $2),
        'first_name', (SELECT first_name FROM users WHERE id = $2),
        'last_name', (SELECT last_name FROM users WHERE id = $2),
        'email', (SELECT email FROM users WHERE id = $2),
        'profile_picture', (SELECT profile_picture FROM users WHERE id = $2)
      ) as user
  `;

    const result = await this.db.query(query, [teamId, userId, role]);

    if (!result.rows.length) {
      throw new NotFoundError("Team member not found");
    }

    return camelcaseKeys(result.rows[0], { deep: true }) as TeamMember;
  }
}

export default TeamMemberRepository;
