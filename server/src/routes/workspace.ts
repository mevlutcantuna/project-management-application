import {
  createWorkspace,
  sendWorkspaceInvitation,
  getWorkspaceMembers,
  deleteWorkspace,
  getWorkspaceById,
  updateWorkspace,
  removeWorkspaceInvitation,
  getWorkspaceMyInvitations,
  acceptWorkspaceInvitation,
  declineWorkspaceInvitation,
  addWorkspaceMember,
} from "@/controllers/workspace";
import { authenticate } from "@/middleware/auth";
import { Router } from "express";

const router = Router();

router.use(authenticate);

router.post("/", createWorkspace);
router.get("/:id", getWorkspaceById);
router.put("/:id", updateWorkspace);
router.delete("/:id", deleteWorkspace);
router.get("/:id/members", getWorkspaceMembers);
router.post("/:id/members", addWorkspaceMember);
router.get("/:id/invitations", getWorkspaceMyInvitations);
router.post("/:id/invitations", sendWorkspaceInvitation);
router.post(
  "/:id/invitations/:invitation_id/accept",
  acceptWorkspaceInvitation
);
router.post(
  "/:id/invitations/:invitation_id/decline",
  declineWorkspaceInvitation
);
router.delete("/:id/invitations/:invitation_id", removeWorkspaceInvitation);

export default router;
