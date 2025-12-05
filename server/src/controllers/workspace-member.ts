import { Request, Response } from "express";
import { WorkspaceMemberService } from "@/services/workspace-member";
import { WorkspaceService } from "@/services/workspace";
import { NotFoundError, UnauthorizedError } from "@/utils/errors";
import { AddWorkspaceMemberRequest } from "@/types/workspace-member";

class WorkspaceMemberController {
  private workspaceMemberService: WorkspaceMemberService;
  private workspaceService: WorkspaceService;

  constructor(
    workspaceMemberService: WorkspaceMemberService,
    workspaceService: WorkspaceService
  ) {
    this.workspaceMemberService = workspaceMemberService;
    this.workspaceService = workspaceService;
  }

  addWorkspaceMember = async (
    req: AddWorkspaceMemberRequest,
    res: Response
  ) => {
    const { workspaceId } = req.params;
    const { userId, role } = req.body;

    // Check if user is workspace owner
    const workspace = await this.workspaceService.getWorkspaceById(workspaceId);
    if (!workspace) throw new NotFoundError("Workspace not found");

    if (workspace.ownerId !== req.user.id)
      throw new UnauthorizedError("You are not the owner of this workspace");

    const member = await this.workspaceMemberService.addUserToWorkspaceMember({
      workspaceId: workspaceId,
      userId: userId,
      role,
    });

    res.status(200).json(member);
  };

  getWorkspaceMembers = async (req: Request, res: Response) => {
    const { workspaceId } = req.params;

    const workspace = await this.workspaceService.getWorkspaceById(workspaceId);
    if (!workspace) throw new NotFoundError("Workspace not found");

    const members =
      await this.workspaceMemberService.getWorkspaceMembers(workspaceId);
    res.status(200).json(members);
  };
}

export default WorkspaceMemberController;
