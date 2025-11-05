import TeamMemberRepository from "@/repositories/team-member";
import { TeamMember } from "@/types/team-member";
import { UserRole } from "@/types/user";

export class TeamMemberService {
  constructor(private teamMemberRepository: TeamMemberRepository) {}

  async addUserToTeam(
    teamId: string,
    userId: string,
    role: UserRole
  ): Promise<TeamMember> {
    const teamMember = await this.teamMemberRepository.addUserToTeam(
      teamId,
      userId,
      role
    );
    return {
      id: teamMember.id,
      teamId: teamMember.teamId,
      userId: teamMember.userId,
      role: teamMember.role,
    };
  }

  async deleteTeamMember(teamId: string, userId: string): Promise<void> {
    return this.teamMemberRepository.deleteTeamMember(teamId, userId);
  }

  async updateTeamMemberRole(
    teamId: string,
    userId: string,
    role: UserRole
  ): Promise<TeamMember> {
    return await this.teamMemberRepository.updateTeamMemberRole(
      teamId,
      userId,
      role
    );
  }
}
