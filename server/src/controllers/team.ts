import { TeamService } from "@/services/team";
import {
  CreateTeamRequest,
  UpdateTeamRequest,
  GetTeamByIdRequest,
  DeleteTeamRequest,
  GetTeamsByWorkspaceRequest,
} from "@/types/team";
import { NotFoundError, UnauthorizedError } from "@/utils/errors";
import { Response } from "express";
import { UserService } from "@/services/user";

class TeamController {
  private teamService: TeamService;
  private userService: UserService;

  constructor(teamService: TeamService, userService: UserService) {
    this.teamService = teamService;
    this.userService = userService;
  }

  createTeam = async (req: CreateTeamRequest, res: Response) => {
    const { name, description, workspaceId } = req.body;

    if (!req.user) throw new UnauthorizedError("User not authenticated");

    const team = await this.teamService.createTeam({
      name,
      description,
      workspaceId,
    });
    res.status(201).json(team);
  };

  updateTeam = async (req: UpdateTeamRequest, res: Response) => {
    const { id } = req.params;
    const { name, description, workspaceId } = req.body;

    if (!req.user) throw new UnauthorizedError("User not authenticated");

    const team = await this.teamService.updateTeam(id, {
      name,
      description,
      workspaceId,
    });
    res.status(200).json(team);
  };

  // Returns all teams which user is a member of
  getTeamsByUserId = async (req: GetTeamsByWorkspaceRequest, res: Response) => {
    const { workspaceId } = req.query;

    if (!req.user) throw new UnauthorizedError("User not authenticated");
    if (!workspaceId || typeof workspaceId !== "string") {
      throw new UnauthorizedError("Workspace ID is required");
    }

    const teams = await this.teamService.getTeamsByUserId(
      workspaceId,
      req.user.id
    );
    res.status(200).json(teams);
  };

  getTeamById = async (req: GetTeamByIdRequest, res: Response) => {
    const { id } = req.params;

    if (!req.user) throw new UnauthorizedError("User not authenticated");

    const team = await this.teamService.getTeamById(id, req.user.id);
    res.status(200).json(team);
  };

  deleteTeam = async (req: DeleteTeamRequest, res: Response) => {
    const { id } = req.params;

    if (!req.user) throw new UnauthorizedError("User not authenticated");

    const team = await this.teamService.getTeamById(id, req.user.id);
    if (!team) throw new NotFoundError("Team not found");

    const isUserTeamAdminOrManager =
      await this.teamService.checkUserIsTeamAdminOrManager(req.user.id, id);
    if (!isUserTeamAdminOrManager)
      throw new UnauthorizedError("User is not a admin or manager of the team");

    await this.teamService.deleteTeam(id);
    res.status(200).json({ message: "Team deleted" });
  };
}

export default TeamController;
