import { Request, Response } from "express";
import { WorkspaceInvitationService } from "@/services/workspace-invitation";
import { WorkspaceMemberService } from "@/services/workspace-member";
import { WorkspaceService } from "@/services/workspace";
import { UserService } from "@/services/user";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "@/utils/errors";
import { SendWorkspaceInvitationRequest } from "@/types/workspace-invitation";

class WorkspaceInvitationController {
  private workspaceInvitationService: WorkspaceInvitationService;
  private workspaceMemberService: WorkspaceMemberService;
  private workspaceService: WorkspaceService;
  private userService: UserService;

  constructor(
    workspaceInvitationService: WorkspaceInvitationService,
    workspaceMemberService: WorkspaceMemberService,
    workspaceService: WorkspaceService,
    userService: UserService
  ) {
    this.workspaceInvitationService = workspaceInvitationService;
    this.workspaceMemberService = workspaceMemberService;
    this.workspaceService = workspaceService;
    this.userService = userService;
  }

  getWorkspaceMyInvitations = async (req: Request, res: Response) => {
    const invitations =
      await this.workspaceInvitationService.getWorkspaceInvitationsByEmail(
        req.user.email
      );

    res.status(200).json(invitations);
  };

  sendWorkspaceInvitation = async (
    req: SendWorkspaceInvitationRequest,
    res: Response
  ) => {
    const { workspaceId } = req.params;
    const { email, role } = req.body;

    const workspace = await this.workspaceService.getWorkspaceById(workspaceId);
    if (!workspace) throw new NotFoundError("Workspace not found");

    const senderMember =
      await this.workspaceMemberService.getWorkspaceMemberByUserId(
        req.user.id,
        workspace.id
      );
    if (!senderMember) throw new UnauthorizedError("Sender user not found");

    const receiver = await this.userService.getUserByEmail(email);
    if (!receiver) throw new NotFoundError("Receiver user not found");

    if (req.user.id === receiver.id)
      throw new ConflictError("email", "You cannot invite yourself");

    // Check if invited by has a valid role such as Admin or Manager
    if (senderMember.role !== "Admin" && senderMember.role !== "Manager")
      throw new UnauthorizedError("You are not authorized to invite users");

    // check if the invitation already exists
    const existingInvitation =
      await this.workspaceInvitationService.getWorkspaceInvitationsByEmail(
        email
      );
    if (existingInvitation.length > 0)
      throw new ConflictError("email", "Invitation already exists");

    // check if the user is already a member of the workspace
    const workspaceMembers =
      await this.workspaceMemberService.getWorkspaceMembers(workspaceId);
    if (workspaceMembers.some((member) => member.userId === receiver.id))
      throw new ConflictError(
        "email",
        "User is already a member of this workspace"
      );

    const invitation =
      await this.workspaceInvitationService.createWorkspaceInvitation({
        workspaceId: workspaceId,
        email,
        role,
        invitedBy: req.user.id,
      });

    res.status(200).json(invitation);
  };

  acceptWorkspaceInvitation = async (req: Request, res: Response) => {
    const { invitationId } = req.params;

    // workspace invitaion exists
    const invitation =
      await this.workspaceInvitationService.getWorkspaceInvitationById(
        invitationId
      );
    if (!invitation) throw new NotFoundError("Invitation not found");

    // check if the invitation is expired
    if (
      await this.workspaceInvitationService.isWorkspaceInvitationExpired(
        invitationId
      )
    )
      throw new BadRequestError("Invitation expired", [
        {
          field: "expiresAt",
          message: "Invitation expired",
        },
      ]);

    // check if the user is the invited user
    if (invitation.email !== req.user.email)
      throw new UnauthorizedError("You are not the invited user");

    // check if the user is already a member of the workspace
    const workspaceMembers =
      await this.workspaceMemberService.getWorkspaceMembers(
        invitation.workspaceId
      );
    if (workspaceMembers.some((member) => member.userId === req.user.id))
      throw new ConflictError(
        "email",
        "User is already a member of this workspace"
      );

    // add the user to the workspace
    await this.workspaceMemberService.addUserToWorkspaceMember({
      workspaceId: invitation.workspaceId,
      userId: req.user.id,
      role: invitation.role,
    });

    // delete the invitation
    await this.workspaceInvitationService.deleteWorkspaceInvitation(
      invitationId
    );

    res.status(200).json({ message: "Invitation accepted" });
  };

  declineWorkspaceInvitation = async (req: Request, res: Response) => {
    const { invitationId } = req.params;

    const invitation =
      await this.workspaceInvitationService.getWorkspaceInvitationById(
        invitationId
      );
    if (!invitation) throw new NotFoundError("Invitation not found");

    // check if the invitation is expired
    if (
      await this.workspaceInvitationService.isWorkspaceInvitationExpired(
        invitationId
      )
    )
      throw new BadRequestError("Invitation expired", [
        {
          field: "expiresAt",
          message: "Invitation expired",
        },
      ]);

    // check if the user is the invited user
    if (invitation.email !== req.user.email)
      throw new UnauthorizedError("You are not the invited user");

    await this.workspaceInvitationService.deleteWorkspaceInvitation(
      invitationId
    );

    res.status(200).json({ message: "Invitation declined" });
  };

  removeWorkspaceInvitation = async (req: Request, res: Response) => {
    const { invitationId } = req.params;

    const invitation =
      await this.workspaceInvitationService.getWorkspaceInvitationById(
        invitationId
      );
    if (!invitation) throw new NotFoundError("Invitation not found");

    // check if the user is the owner of the workspace
    if (invitation.invitedBy !== req.user.id)
      throw new UnauthorizedError("You are not the owner of this workspace");

    await this.workspaceInvitationService.deleteWorkspaceInvitation(
      invitationId
    );

    res.status(200).json({ message: "Invitation removed" });
  };
}

export default WorkspaceInvitationController;
