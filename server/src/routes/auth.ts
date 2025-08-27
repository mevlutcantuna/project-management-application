import AuthController from "../controllers/auth";
import { AuthService } from "@/services/auth";
import { db } from "@/config/dbClient";
import { Router } from "express";

const router = Router();

const authService = new AuthService(db);
const authController = new AuthController(authService);

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);

export default router;
