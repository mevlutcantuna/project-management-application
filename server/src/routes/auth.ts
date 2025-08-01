import { login, register } from "@/controllers/auth";
import { Router } from "express";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", (req, res) => {
  res.status(200).json({ message: "User logged in successfully" });
});

export default router;
