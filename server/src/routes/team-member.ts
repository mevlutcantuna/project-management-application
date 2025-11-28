import { Router } from "express";
import { authenticate } from "@/middleware/auth";
import { TeamMemberService } from "@/services/team-member";
import { db } from "@/config/dbClient";
import TeamMemberController from "@/controllers/team-member";
import { TeamService } from "@/services/team";
import TeamMemberRepository from "@/repositories/team-member";
import { UserService } from "@/services/user";
import { WorkspaceService } from "@/services/workspace";

const router = Router({ mergeParams: true });

router.use(authenticate);

const teamMemberRepository = new TeamMemberRepository(db);
const teamMemberService = new TeamMemberService(teamMemberRepository);
const teamService = new TeamService(db);
const userService = new UserService(db);
const workspaceService = new WorkspaceService(db);

const teamMemberController = new TeamMemberController(
  teamMemberService,
  teamService,
  userService,
  workspaceService
);

router.post("/", teamMemberController.addUserToTeam);
router.put("/:userId", teamMemberController.updateTeamMemberRole);
router.delete("/:userId", teamMemberController.deleteTeamMember);
router.post("/leave", teamMemberController.leaveTeam);

export default router;
