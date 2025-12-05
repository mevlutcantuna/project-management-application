import { Router } from "express";
import authRouter from "./auth";
import userRouter from "./user";
import workspaceRouter from "./workspace";
import teamRouter from "./team";
import teamMemberRouter from "./team-member";
import workspaceMemberRouter from "./workspace-member";
import workspaceInvitationRouter from "./workspace-invitation";
import workspaceStatusRouter from "./workspace-status";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/workspaces", workspaceRouter);
router.use("/workspaces/:workspaceId/members", workspaceMemberRouter);
router.use("/workspaces/:workspaceId/invitations", workspaceInvitationRouter);
router.use("/workspaces/:workspaceId/statuses", workspaceStatusRouter);
router.use("/workspaces/:workspaceId/teams", teamRouter);
router.use("/workspaces/:workspaceId/teams/:teamId/members", teamMemberRouter);

export default router;
