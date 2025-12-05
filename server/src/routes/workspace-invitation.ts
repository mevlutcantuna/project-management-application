import { Router } from "express";
import { authenticate } from "@/middleware/auth";
import { db } from "@/config/dbClient";
import { WorkspaceInvitationService } from "@/services/workspace-invitation";
import { WorkspaceMemberService } from "@/services/workspace-member";
import { WorkspaceService } from "@/services/workspace";
import { UserService } from "@/services/user";
import WorkspaceInvitationController from "@/controllers/workspace-invitation";

const router = Router({ mergeParams: true });

router.use(authenticate);

const workspaceInvitationService = new WorkspaceInvitationService(db);
const workspaceMemberService = new WorkspaceMemberService(db);
const workspaceService = new WorkspaceService(db);
const userService = new UserService(db);
const workspaceInvitationController = new WorkspaceInvitationController(
  workspaceInvitationService,
  workspaceMemberService,
  workspaceService,
  userService
);

router.get("/", workspaceInvitationController.getWorkspaceMyInvitations);
router.post("/", workspaceInvitationController.sendWorkspaceInvitation);
router.post(
  "/:invitationId/accept",
  workspaceInvitationController.acceptWorkspaceInvitation
);
router.post(
  "/:invitationId/decline",
  workspaceInvitationController.declineWorkspaceInvitation
);
router.delete(
  "/:invitationId",
  workspaceInvitationController.removeWorkspaceInvitation
);

export default router;
