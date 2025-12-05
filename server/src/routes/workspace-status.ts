import { Router } from "express";
import { authenticate } from "@/middleware/auth";
import { db } from "@/config/dbClient";
import { WorkspaceStatusService } from "@/services/workspace-status";
import { WorkspaceMemberService } from "@/services/workspace-member";
import WorkspaceStatusController from "@/controllers/workspace-status";

const router = Router({ mergeParams: true });

router.use(authenticate);

const workspaceStatusService = new WorkspaceStatusService(db);
const workspaceMemberService = new WorkspaceMemberService(db);
const workspaceStatusController = new WorkspaceStatusController(
  workspaceStatusService,
  workspaceMemberService
);

router.get("/", workspaceStatusController.getWorkspaceStatuses);
router.post("/", workspaceStatusController.createWorkspaceStatus);
router.put("/:statusId", workspaceStatusController.updateWorkspaceStatus);
router.delete("/:statusId", workspaceStatusController.deleteWorkspaceStatus);

export default router;
