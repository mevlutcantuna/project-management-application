import WorkspaceController from "../controllers/workspace";
import { authenticate } from "@/middleware/auth";
import { Router } from "express";
import { WorkspaceService } from "@/services/workspace";
import { UserService } from "@/services/user";
import { db } from "@/config/dbClient";

const router = Router();

router.use(authenticate);

const workspaceService = new WorkspaceService(db);
const userService = new UserService(db);
const workspaceController = new WorkspaceController(
  workspaceService,
  userService
);

router.get("/", workspaceController.getMyWorkspaces);
router.post("/", workspaceController.createWorkspace);
router.get("/:id", workspaceController.getWorkspaceById);
router.put("/:id", workspaceController.updateWorkspace);
router.delete("/:id", workspaceController.deleteWorkspace);
router.get("/:id/members", workspaceController.getWorkspaceMembers);
router.post("/:id/members", workspaceController.addWorkspaceMember);
router.get("/:id/invitations", workspaceController.getWorkspaceMyInvitations);
router.post("/:id/invitations", workspaceController.sendWorkspaceInvitation);
router.post(
  "/:id/invitations/:invitation_id/accept",
  workspaceController.acceptWorkspaceInvitation
);
router.post(
  "/:id/invitations/:invitation_id/decline",
  workspaceController.declineWorkspaceInvitation
);
router.delete(
  "/:id/invitations/:invitation_id",
  workspaceController.removeWorkspaceInvitation
);

export default router;
