import { TeamService } from "@/services/team";
import {
  CreateTeamRequest,
  UpdateTeamRequest,
  GetTeamByIdRequest,
  DeleteTeamRequest,
  GetTeamsByWorkspaceRequest,
} from "@/types/team";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "@/utils/errors";
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
    const { name, identifier, workspaceId, iconName, color, userIds } =
      req.body;

    if (!req.user) throw new UnauthorizedError("User not authenticated");

    // Check if the identifier already exists
    const existingTeam =
      await this.teamService.checkTeamIdentifierExistsForWorkspace(
        workspaceId,
        identifier
      );
    if (existingTeam)
      throw new ConflictError(
        "identifier",
        "Team identifier already exists for this workspace"
      );

    // Check if the userIds are valid
    if (userIds && userIds.length > 0) {
      const users = await this.userService.getUsersByIds(userIds);

      if (users.length !== userIds.length)
        throw new BadRequestError("Invalid user IDs", [
          {
            field: "userIds",
            message: "Invalid user IDs",
          },
        ]);
    }

    const team = await this.teamService.createTeam({
      name,
      identifier,
      workspaceId,
      iconName,
      color,
      userIds,
    });
    res.status(201).json(team);
  };

  updateTeam = async (req: UpdateTeamRequest, res: Response) => {
    const { id } = req.params;
    const { name, identifier, workspaceId, iconName, color, userIds } =
      req.body;

    if (!req.user) throw new UnauthorizedError("User not authenticated");

    // Check if the identifier already exists
    if (identifier && identifier !== "" && workspaceId) {
      const existingTeam =
        await this.teamService.checkTeamIdentifierExistsForWorkspaceExceptCurrentTeam(
          workspaceId,
          identifier,
          id
        );
      if (existingTeam)
        throw new ConflictError(
          "identifier",
          "Team identifier already exists for this workspace"
        );
    }

    // Check if the userIds are valid
    if (userIds && userIds.length > 0) {
      const users = await this.userService.getUsersByIds(userIds);

      if (users.length !== userIds.length)
        throw new BadRequestError("Invalid user IDs", [
          {
            field: "userIds",
            message: "Invalid user IDs",
          },
        ]);
    }

    const team = await this.teamService.updateTeam(id, {
      name,
      identifier,
      workspaceId,
      iconName,
      color,
    });
    res.status(200).json(team);
  };

  getTeams = async (req: GetTeamsByWorkspaceRequest, res: Response) => {
    const { workspaceId } = req.params;

    console.log("getTeams", workspaceId);

    if (!req.user) throw new UnauthorizedError("User not authenticated");
    if (!workspaceId || typeof workspaceId !== "string") {
      throw new UnauthorizedError("Workspace ID is required");
    }

    const teams = await this.teamService.getTeams(workspaceId);
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
