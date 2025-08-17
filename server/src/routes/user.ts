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

router.get("/users/", getAllUsers);
router.get("/users/:id", getUser);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", updateUser);

export default router;
