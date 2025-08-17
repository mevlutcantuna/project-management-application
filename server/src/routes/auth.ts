import { login, refreshToken, signup } from "../controllers/auth";
import { Router } from "express";

const router = Router();

// Auth routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/refresh", refreshToken);

// Protected route (placeholder for future implementation)
router.get("/me", (req, res) => {
  res
    .status(200)
    .json({ message: "User profile endpoint - implement JWT middleware" });
});

export default router;
