import { Request, Response } from "express";
import { WorkspaceStatusService } from "@/services/workspace-status";
import { WorkspaceMemberService } from "@/services/workspace-member";
import { NotFoundError, UnauthorizedError } from "@/utils/errors";

class WorkspaceStatusController {
  private workspaceStatusService: WorkspaceStatusService;
  private workspaceMemberService: WorkspaceMemberService;

  constructor(
    workspaceStatusService: WorkspaceStatusService,
    workspaceMemberService: WorkspaceMemberService
  ) {
    this.workspaceStatusService = workspaceStatusService;
    this.workspaceMemberService = workspaceMemberService;
  }

  getWorkspaceStatuses = async (req: Request, res: Response) => {
    const { workspaceId } = req.params;

    // Ensure workspace member
    const workspaceMembers =
      await this.workspaceMemberService.getWorkspaceMembers(workspaceId);
    if (!workspaceMembers.some((member) => member.userId === req.user.id))
      throw new UnauthorizedError("You are not a member of this workspace");

    const statuses =
      await this.workspaceStatusService.getWorkspaceStatuses(workspaceId);
    res.status(200).json(statuses);
  };

  createWorkspaceStatus = async (req: Request, res: Response) => {
    const { workspaceId } = req.params;
    const { name, iconName, color } = req.body;

    // Ensure workspace member
    const workspaceMembers =
      await this.workspaceMemberService.getWorkspaceMembers(workspaceId);
    if (!workspaceMembers.some((member) => member.userId === req.user.id))
      throw new UnauthorizedError("You are not a member of this workspace");

    const status = await this.workspaceStatusService.createWorkspaceStatus({
      workspaceId: workspaceId,
      name,
      iconName,
      color,
      createdById: req.user.id,
    });

    res.status(200).json(status);
  };

  updateWorkspaceStatus = async (req: Request, res: Response) => {
    const { workspaceId, statusId } = req.params;
    const { name, iconName, color } = req.body;

    // Ensure workspace admin or manager
    const workspaceMembers =
      await this.workspaceMemberService.getWorkspaceMembers(workspaceId);
    if (!workspaceMembers.some((member) => member.userId === req.user.id))
      throw new UnauthorizedError("You are not a member of this workspace");

    const member = workspaceMembers.find(
      (member) => member.userId === req.user.id
    );
    if (member && member.role !== "Admin" && member.role !== "Manager")
      throw new UnauthorizedError(
        "You are not the admin or manager of this workspace"
      );

    // Check the status already exists
    const existingStatus =
      await this.workspaceStatusService.getWorkspaceStatusById(statusId);
    if (!existingStatus) throw new NotFoundError("Status not found");

    const status = await this.workspaceStatusService.updateWorkspaceStatus({
      id: statusId,
      name,
      iconName,
      color,
    });

    res.status(200).json(status);
  };

  deleteWorkspaceStatus = async (req: Request, res: Response) => {
    const { workspaceId, statusId } = req.params;

    // Ensure workspace admin or manager
    const workspaceMembers =
      await this.workspaceMemberService.getWorkspaceMembers(workspaceId);
    if (!workspaceMembers.some((member) => member.userId === req.user.id))
      throw new UnauthorizedError("You are not a member of this workspace");

    const member = workspaceMembers.find(
      (member) => member.userId === req.user.id
    );
    if (member && member.role !== "Admin" && member.role !== "Manager")
      throw new UnauthorizedError(
        "You are not the admin or manager of this workspace"
      );

    await this.workspaceStatusService.deleteWorkspaceStatus(statusId);

    res.status(200).json({ message: "Workspace status deleted" });
  };
}

export default WorkspaceStatusController;
