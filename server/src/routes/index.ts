import { Router } from "express";
import authRouter from "./auth";
import userRouter from "./user";
import workspaceRouter from "./workspace";
import teamRouter from "./team";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/workspaces", workspaceRouter);
router.use("/:workspaceId/teams", teamRouter);

export default router;
