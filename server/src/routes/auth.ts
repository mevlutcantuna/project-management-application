import { login, refreshToken, signup } from "../controllers/auth";
import { Router } from "express";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/refresh", refreshToken);

export default router;
