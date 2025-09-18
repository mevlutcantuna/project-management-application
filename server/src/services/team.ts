import Database from "@/config/db";
import TeamRepository from "@/repositories/team";
import { CreateTeamInput, Team, UpdateTeamInput } from "@/types/team";
import { UnauthorizedError } from "@/utils/errors";

export class TeamService {
  private teamRepository: TeamRepository;

  constructor(private db: Database) {
    this.teamRepository = new TeamRepository(db);
  }

  async createTeam(values: CreateTeamInput): Promise<Team> {
    return this.teamRepository.createTeam(values);
  }

  async updateTeam(id: string, values: UpdateTeamInput): Promise<Team> {
    return this.teamRepository.updateTeam(id, values);
  }

  async getTeamsByUserId(workspaceId: string, userId: string): Promise<Team[]> {
    return this.teamRepository.getTeamsByUserId(workspaceId, userId);
  }

  async getTeamById(id: string, userId: string): Promise<Team | null> {
    const isUserTeamMember = await this.teamRepository.checkUserIsTeamMember(
      userId,
      id
    );

    if (!isUserTeamMember)
      throw new UnauthorizedError("User is not a member of the team");

    return this.teamRepository.getTeamById(id);
  }

  async deleteTeam(id: string): Promise<void> {
    return this.teamRepository.deleteTeam(id);
  }

  async checkUserIsTeamAdminOrManager(
    userId: string,
    teamId: string
  ): Promise<boolean> {
    return this.teamRepository.checkUserIsTeamAdminOrManager(userId, teamId);
  }

  async checkUserIsTeamMember(
    userId: string,
    teamId: string
  ): Promise<boolean> {
    return this.teamRepository.checkUserIsTeamMember(userId, teamId);
  }
}
