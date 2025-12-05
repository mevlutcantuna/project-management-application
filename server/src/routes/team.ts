import { Router } from "express";
import { authenticate } from "@/middleware/auth";
import { TeamService } from "@/services/team";
import { db } from "@/config/dbClient";
import TeamController from "@/controllers/team";
import { UserService } from "@/services/user";
import { WorkspaceMemberService } from "@/services/workspace-member";

const router = Router({ mergeParams: true });

router.use(authenticate);

const teamService = new TeamService(db);
const userService = new UserService(db);
const workspaceMemberService = new WorkspaceMemberService(db);
const teamController = new TeamController(
  teamService,
  userService,
  workspaceMemberService
);

router.post("/", teamController.createTeam);
router.put("/:id", teamController.updateTeam);
router.get("/", teamController.getTeams);
router.get("/:id", teamController.getTeamById);
router.get("/by-identifier/:identifier", teamController.getTeamByIdentifier);
router.delete("/:id", teamController.deleteTeam);

export default router;
