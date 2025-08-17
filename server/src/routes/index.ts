import { Router } from "express";
import authRouter from "./auth";
import userRouter from "./user";
import workspaceRouter from "./workspace";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/workspaces", workspaceRouter);

export default router;
