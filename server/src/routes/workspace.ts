import { Router } from "express";
import { authenticate } from "@/middleware/auth";
import { db } from "@/config/dbClient";
import { WorkspaceService } from "@/services/workspace";
import { WorkspaceMemberService } from "@/services/workspace-member";
import WorkspaceController from "@/controllers/workspace";

const router = Router({ mergeParams: true });

router.use(authenticate);

const workspaceService = new WorkspaceService(db);
const workspaceMemberService = new WorkspaceMemberService(db);
const workspaceController = new WorkspaceController(
  workspaceService,
  workspaceMemberService
);

router.get("/", workspaceController.getMyWorkspaces);
router.post("/", workspaceController.createWorkspace);
router.get("/by-url/:url", workspaceController.getWorkspaceByUrl);
router.get("/:workspaceId", workspaceController.getWorkspaceById);
router.put("/:workspaceId", workspaceController.updateWorkspace);
router.delete("/:workspaceId", workspaceController.deleteWorkspace);

export default router;
