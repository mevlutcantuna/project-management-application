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

  async getTeams(workspaceId: string): Promise<Team[]> {
    return this.teamRepository.getTeams(workspaceId);
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

  async getTeamByIdentifier(
    identifier: string,
    workspaceId: string,
    userId: string
  ): Promise<Team | null> {
    const isUserTeamMember =
      await this.teamRepository.checkUserIsTeamMemberWithTeamIdentifier(
        userId,
        identifier,
        workspaceId
      );

    if (!isUserTeamMember)
      throw new UnauthorizedError("User is not a member of the team");

    return this.teamRepository.getTeamByIdentifier(identifier, workspaceId);
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

  async checkTeamIdentifierExistsForWorkspace(
    workspaceId: string,
    identifier: string
  ): Promise<boolean> {
    return this.teamRepository.checkTeamIdentifierExistsForWorkspace(
      workspaceId,
      identifier
    );
  }

  async checkTeamIdentifierExistsForWorkspaceExceptCurrentTeam(
    workspaceId: string,
    identifier: string,
    currentTeamId: string
  ): Promise<boolean> {
    return this.teamRepository.checkTeamIdentifierExistsForWorkspaceExceptCurrentTeam(
      workspaceId,
      identifier,
      currentTeamId
    );
  }
}
