import { Request, Response } from "express";
import { TeamMemberService } from "@/services/team-member";
import {
  AddUserToTeamRequest,
  DeleteTeamMemberRequest,
  UpdateTeamMemberRoleRequest,
} from "@/types/team-member";
import { TeamService } from "@/services/team";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/utils/errors";
import { UserService } from "@/services/user";
import { WorkspaceService } from "@/services/workspace";

class TeamMemberController {
  private teamMemberService: TeamMemberService;
  private teamService: TeamService;
  private userService: UserService;
  private workspaceService: WorkspaceService;

  constructor(
    teamMemberService: TeamMemberService,
    teamService: TeamService,
    userService: UserService,
    workspaceService: WorkspaceService
  ) {
    this.teamMemberService = teamMemberService;
    this.teamService = teamService;
    this.userService = userService;
    this.workspaceService = workspaceService;
  }

  private async ensureTeamAdminOrManager(teamId: string, userId: string) {
    const team = await this.teamService.getTeamById(teamId, userId);
    if (!team) throw new NotFoundError("Team not found");

    const isUserTeamAdminOrManager =
      await this.teamService.checkUserIsTeamAdminOrManager(userId, teamId);
    if (!isUserTeamAdminOrManager)
      throw new UnauthorizedError(
        "You are not authorized to perform this action"
      );

    return team;
  }

  addUserToTeam = async (req: AddUserToTeamRequest, res: Response) => {
    const { email, role } = req.body;
    const { teamId } = req.params;

    const team = await this.ensureTeamAdminOrManager(teamId, req.user.id);

    const user = await this.userService.getUserByEmail(email);
    if (!user) throw new NotFoundError("User not found");

    // Check if the user is still in the current team
    const isUserInTeam = await this.teamService.checkUserIsTeamMember(
      user.id,
      teamId
    );

    if (isUserInTeam)
      throw new BadRequestError("User is already a member of this team");

    // If user is not in the workspace, add them to the workspace
    const isUserInWorkspace =
      await this.workspaceService.checkUserIsWorkspaceMember(
        user.id,
        team.workspaceId
      );
    if (!isUserInWorkspace)
      await this.workspaceService.addUserToWorkspaceMember({
        workspaceId: team.workspaceId,
        userId: user.id,
        role: "Member",
      });

    const member = await this.teamMemberService.addUserToTeam(
      teamId,
      user.id,
      role
    );

    res.status(201).json(member);
  };

  updateTeamMemberRole = async (
    req: UpdateTeamMemberRoleRequest,
    res: Response
  ) => {
    const { teamId, userId } = req.params;
    const { role } = req.body;

    await this.ensureTeamAdminOrManager(teamId, req.user.id);

    const member = await this.teamMemberService.updateTeamMemberRole(
      teamId,
      userId,
      role
    );
    res.status(200).json(member);
  };

  deleteTeamMember = async (req: DeleteTeamMemberRequest, res: Response) => {
    const { teamId, userId } = req.params;

    await this.ensureTeamAdminOrManager(teamId, req.user.id);

    await this.teamMemberService.deleteTeamMember(teamId, userId);
    res.status(200).json({ message: "success" });
  };

  leaveTeam = async (req: Request, res: Response) => {
    const { teamId } = req.params;
    const userId = req.user.id;

    const team = await this.teamService.getTeamById(teamId, req.user.id);
    if (!team) throw new NotFoundError("Team not found");

    const isUserTeamMember = await this.teamService.checkUserIsTeamMember(
      userId,
      teamId
    );

    if (!isUserTeamMember)
      throw new UnauthorizedError("You are not a member of this team");

    await this.teamMemberService.deleteTeamMember(teamId, userId);
    res.status(200).json({ message: "success" });
  };
}

export default TeamMemberController;
