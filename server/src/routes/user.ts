import { Router } from "express";
import {
  deleteUser,
  getUser,
  getAllUsers,
  updateUser,
} from "@/controllers/user";
import { authenticate } from "@/middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/", getAllUsers);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

export default router;
