import AuthController from "../controllers/auth";
import { AuthService } from "@/services/auth";
import { db } from "@/config/dbClient";
import { Router } from "express";
import { authenticate } from "@/middleware/auth";

const router = Router();

const authService = new AuthService(db);
const authController = new AuthController(authService);

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);
router.get("/me", authenticate, authController.getMe);

export default router;
