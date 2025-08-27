import { Router } from "express";
import UserController from "../controllers/user";
import { authenticate } from "@/middleware/auth";
import { UserService } from "@/services/user";
import { db } from "@/config/dbClient";

const router = Router();

router.use(authenticate);

const userService = new UserService(db);
const userController = new UserController(userService);

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUser);
router.delete("/:id", userController.deleteUser);
router.put("/:id", userController.updateUser);

export default router;
