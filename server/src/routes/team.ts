import { Router } from "express";
import { authenticate } from "@/middleware/auth";
import { TeamService } from "@/services/team";
import { db } from "@/config/dbClient";
import TeamController from "@/controllers/team";
import { UserService } from "@/services/user";

const router = Router({ mergeParams: true });

router.use(authenticate);

const teamService = new TeamService(db);
const userService = new UserService(db);
const teamController = new TeamController(teamService, userService);

router.post("/", teamController.createTeam);
router.put("/:id", teamController.updateTeam);
router.get("/", teamController.getTeams);
router.get("/:id", teamController.getTeamById);
router.delete("/:id", teamController.deleteTeam);

export default router;
