import { Request, Response, NextFunction } from "express";
import { WorkspaceService } from "@/services/workspace";
import { WorkspaceMemberService } from "@/services/workspace-member";
import { NotFoundError, UnauthorizedError } from "@/utils/errors";

export class WorkspaceAuthMiddleware {
  constructor(
    private workspaceService: WorkspaceService,
    private workspaceMemberService: WorkspaceMemberService
  ) {}

  ensureWorkspaceMember = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const workspaceId = req.params.id || req.params.workspaceId;
      const userId = req.user.id;

      const workspaceMembers =
        await this.workspaceMemberService.getWorkspaceMembers(workspaceId);
      if (!workspaceMembers.some((member) => member.userId === userId)) {
        throw new UnauthorizedError("You are not a member of this workspace");
      }

      next();
    } catch (error) {
      next(error);
    }
  };

  ensureWorkspaceOwner = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const workspaceId = req.params.id || req.params.workspaceId;
      const userId = req.user.id;

      const workspace =
        await this.workspaceService.getWorkspaceById(workspaceId);
      if (!workspace) throw new NotFoundError("Workspace not found");

      if (workspace.ownerId !== userId) {
        throw new UnauthorizedError("You are not the owner of this workspace");
      }

      // Attach workspace to request for later use
      req.workspace = workspace;

      next();
    } catch (error) {
      next(error);
    }
  };

  ensureWorkspaceAdminOrManager = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const workspaceId = req.params.id || req.params.workspaceId;
      const userId = req.user.id;

      const workspaceMembers =
        await this.workspaceMemberService.getWorkspaceMembers(workspaceId);
      if (!workspaceMembers.some((member) => member.userId === userId)) {
        throw new UnauthorizedError("You are not a member of this workspace");
      }

      const member = workspaceMembers.find(
        (member) => member.userId === userId
      );
      if (member && member.role !== "Admin" && member.role !== "Manager") {
        throw new UnauthorizedError(
          "You are not the admin or manager of this workspace"
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
