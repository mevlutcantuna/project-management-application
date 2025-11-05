import { Response } from "express";
import { TeamMemberService } from "@/services/team-member";
import {
  AddUserToTeamRequest,
  DeleteTeamMemberRequest,
  UpdateTeamMemberRoleRequest,
} from "@/types/team-member";
import { TeamService } from "@/services/team";
import { NotFoundError, UnauthorizedError } from "@/utils/errors";

class TeamMemberController {
  private teamMemberService: TeamMemberService;
  private teamService: TeamService;

  constructor(teamMemberService: TeamMemberService, teamService: TeamService) {
    this.teamMemberService = teamMemberService;
    this.teamService = teamService;
  }

  addUserToTeam = async (req: AddUserToTeamRequest, res: Response) => {
    const { teamId, userId, role } = req.body;

    // Check if the team exists
    const team = await this.teamService.getTeamById(teamId, req.user.id);
    if (!team) throw new NotFoundError("Team not found");

    // Check if the adder user is a admin or manager of the team
    const isUserTeamAdminOrManager =
      await this.teamService.checkUserIsTeamAdminOrManager(req.user.id, teamId);
    if (!isUserTeamAdminOrManager)
      throw new UnauthorizedError(
        "You are not authorized to add users to this team"
      );

    const member = await this.teamMemberService.addUserToTeam(
      teamId,
      userId,
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

    // Check if the team exists
    const team = await this.teamService.getTeamById(teamId, req.user.id);
    if (!team) throw new NotFoundError("Team not found");

    // Check if the updater user is a admin or manager of the team
    const isUserTeamAdminOrManager =
      await this.teamService.checkUserIsTeamAdminOrManager(req.user.id, teamId);
    if (!isUserTeamAdminOrManager)
      throw new UnauthorizedError(
        "You are not authorized to update the role of this team member"
      );

    const member = await this.teamMemberService.updateTeamMemberRole(
      teamId,
      userId,
      role
    );
    res.status(200).json(member);
  };

  deleteTeamMember = async (req: DeleteTeamMemberRequest, res: Response) => {
    const { teamId, userId } = req.params;

    // Check if the team exists
    const team = await this.teamService.getTeamById(teamId, req.user.id);
    if (!team) throw new NotFoundError("Team not found");

    // Check if the deleter user is a admin or manager of the team
    const isUserTeamAdminOrManager =
      await this.teamService.checkUserIsTeamAdminOrManager(req.user.id, teamId);
    if (!isUserTeamAdminOrManager)
      throw new UnauthorizedError(
        "You are not authorized to delete this team member"
      );

    await this.teamMemberService.deleteTeamMember(teamId, userId);
    res.status(200).json({ message: "success" });
  };
}

export default TeamMemberController;
