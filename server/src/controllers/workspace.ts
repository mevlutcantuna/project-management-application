import { Request, Response } from "express";
import { WorkspaceService } from "@/services/workspace";
import { WorkspaceMemberService } from "@/services/workspace-member";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@/utils/errors";
import {
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
} from "@/types/workspace";
import { createWorkspaceSchema } from "@/schemas/workspace";

class WorkspaceController {
  private workspaceService: WorkspaceService;
  private workspaceMemberService: WorkspaceMemberService;

  constructor(
    workspaceService: WorkspaceService,
    workspaceMemberService: WorkspaceMemberService
  ) {
    this.workspaceService = workspaceService;
    this.workspaceMemberService = workspaceMemberService;
  }

  createWorkspace = async (req: CreateWorkspaceRequest, res: Response) => {
    const validatedData = createWorkspaceSchema.safeParse(req.body);
    if (!validatedData.success) throw new ValidationError(validatedData.error);

    const { name, description = "", url } = validatedData.data;

    // check if the workspace url already exists
    const existingWorkspaceByUrl =
      await this.workspaceService.getWorkspaceByUrl(url);
    if (existingWorkspaceByUrl)
      throw new ConflictError("url", "Workspace url already exists");

    // Check if the workspace name already exists for the user
    const existingWorkspaceByName =
      await this.workspaceService.getWorkspaceByName(name);
    if (existingWorkspaceByName)
      throw new ConflictError("name", "Workspace name already exists");

    const workspace = await this.workspaceService.createWorkspace({
      name,
      description,
      ownerId: req.user.id,
      url: url.toLowerCase().trim(),
    });

    res.status(201).json(workspace);
  };

  getWorkspaceById = async (req: Request, res: Response) => {
    const { workspaceId } = req.params;

    // Ensure workspace member
    const workspaceMembers =
      await this.workspaceMemberService.getWorkspaceMembers(workspaceId);
    if (!workspaceMembers.some((member) => member.userId === req.user.id))
      throw new UnauthorizedError("You are not a member of this workspace");

    const workspace = await this.workspaceService.getWorkspaceById(workspaceId);
    if (!workspace) throw new NotFoundError("Workspace not found");

    res.status(200).json(workspace);
  };

  getWorkspaceByUrl = async (req: Request, res: Response) => {
    const { url } = req.params;

    const workspaceByUrl = await this.workspaceService.getWorkspaceByUrl(url);
    if (!workspaceByUrl) throw new NotFoundError("Workspace not found");

    // Ensure workspace member
    const workspaceMembers =
      await this.workspaceMemberService.getWorkspaceMembers(workspaceByUrl.id);
    if (!workspaceMembers.some((member) => member.userId === req.user.id))
      throw new UnauthorizedError("You are not a member of this workspace");

    res.status(200).json(workspaceByUrl);
  };

  getMyWorkspaces = async (req: Request, res: Response) => {
    const workspaces = await this.workspaceService.getWorkspacesByUserId(
      req.user.id
    );
    res.status(200).json(workspaces);
  };

  updateWorkspace = async (req: UpdateWorkspaceRequest, res: Response) => {
    const { workspaceId } = req.params;
    const { name, description } = req.body;

    // Ensure workspace owner
    const workspace = await this.workspaceService.getWorkspaceById(workspaceId);
    if (!workspace) throw new NotFoundError("Workspace not found");

    if (workspace.ownerId !== req.user.id)
      throw new UnauthorizedError("You are not the owner of this workspace");

    const updatedWorkspace = await this.workspaceService.updateWorkspace({
      id: workspaceId,
      name,
      description,
    });

    res.status(200).json(updatedWorkspace);
  };

  deleteWorkspace = async (req: Request, res: Response) => {
    const { workspaceId } = req.params;

    // Ensure workspace owner
    const workspace = await this.workspaceService.getWorkspaceById(workspaceId);
    if (!workspace) throw new NotFoundError("Workspace not found");

    if (workspace.ownerId !== req.user.id)
      throw new UnauthorizedError("You are not the owner of this workspace");

    await this.workspaceService.deleteWorkspace(workspaceId);

    res.status(200).json({ message: "Workspace deleted" });
  };
}

export default WorkspaceController;
