import { signup } from "../controllers/auth";
import { Router } from "express";

const router = Router();

// Auth routes
router.post("/auth/signup", signup);
router.post("/auth/login", (req, res) => {
  res
    .status(200)
    .json({ message: "Login endpoint - implement JWT middleware" });
});

// Protected route (placeholder for future implementation)
router.get("/auth/me", (req, res) => {
  res
    .status(200)
    .json({ message: "User profile endpoint - implement JWT middleware" });
});

export default router;
