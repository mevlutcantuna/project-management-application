import { Router } from "express";
import { authenticate } from "@/middleware/auth";
import { db } from "@/config/dbClient";
import { WorkspaceMemberService } from "@/services/workspace-member";
import { WorkspaceService } from "@/services/workspace";
import WorkspaceMemberController from "@/controllers/workspace-member";

const router = Router({ mergeParams: true });

router.use(authenticate);

const workspaceMemberService = new WorkspaceMemberService(db);
const workspaceService = new WorkspaceService(db);
const workspaceMemberController = new WorkspaceMemberController(
  workspaceMemberService,
  workspaceService
);

// /workspaces/:workspaceId/members
router.get("/", workspaceMemberController.getWorkspaceMembers);
router.post("/", workspaceMemberController.addWorkspaceMember);

export default router;
