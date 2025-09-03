import { Request, Response } from "express";
import { WorkspaceService } from "@/services/workspace";
import { extractTokenFromHeader, verifyToken } from "@/utils/jwt";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "@/utils/errors";
import { UserService } from "@/services/user";
import {
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  AddWorkspaceMemberRequest,
  SendWorkspaceInvitationRequest,
} from "@/types/workspace";

class WorkspaceController {
  private workspaceService: WorkspaceService;
  private userService: UserService;

  constructor(workspaceService: WorkspaceService, userService: UserService) {
    this.workspaceService = workspaceService;
    this.userService = userService;
  }

  // Workspaces

  createWorkspace = async (req: CreateWorkspaceRequest, res: Response) => {
    const { title, description } = req.body;

    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) throw new UnauthorizedError("No token provided");

    const payload = verifyToken(token);
    if (!payload) throw new UnauthorizedError("Invalid token");

    const user = await this.userService.getUserById(payload.sub);
    if (!user) throw new UnauthorizedError("User not found");

    const workspace = await this.workspaceService.createWorkspace({
      title,
      description,
      ownerId: user.id,
    });

    res.status(201).json(workspace);
  };

  getWorkspaceById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const workspace = await this.workspaceService.getWorkspaceById(id);
    if (!workspace) throw new NotFoundError("Workspace not found");

    res.status(200).json(workspace);
  };

  getMyWorkspaces = async (req: Request, res: Response) => {
    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) throw new UnauthorizedError("No token provided");

    const payload = verifyToken(token);
    if (!payload) throw new UnauthorizedError("Invalid token");

    const user = await this.userService.getUserById(payload.sub);
    if (!user) throw new UnauthorizedError("User not found");

    const workspaces = await this.workspaceService.getWorkspacesByUserId(
      user.id
    );
    res.status(200).json(workspaces);
  };

  updateWorkspace = async (req: UpdateWorkspaceRequest, res: Response) => {
    const { id } = req.params;
    const { title, description } = req.body;

    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) throw new UnauthorizedError("No token provided");

    const payload = verifyToken(token);
    if (!payload) throw new UnauthorizedError("Invalid token");

    const user = await this.userService.getUserById(payload.sub);
    if (!user) throw new UnauthorizedError("User not found");

    const workspace = await this.workspaceService.getWorkspaceById(id);
    if (!workspace) throw new NotFoundError("Workspace not found");

    if (workspace.ownerId !== user.id)
      throw new UnauthorizedError("You are not the owner of this workspace");

    const updatedWorkspace = await this.workspaceService.updateWorkspace({
      id: id,
      title,
      description,
    });

    res.status(200).json(updatedWorkspace);
  };

  deleteWorkspace = async (req: Request, res: Response) => {
    const { id } = req.params;

    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) throw new UnauthorizedError("No token provided");

    const payload = verifyToken(token);
    if (!payload) throw new UnauthorizedError("Invalid token");

    const user = await this.userService.getUserById(payload.sub);
    if (!user) throw new UnauthorizedError("User not found");

    const workspace = await this.workspaceService.getWorkspaceById(id);
    if (!workspace) throw new NotFoundError("Workspace not found");

    if (workspace.ownerId !== user.id)
      throw new UnauthorizedError("You are not the owner of this workspace");

    await this.workspaceService.deleteWorkspace(id);

    res.status(200).json({ message: "Workspace deleted" });
  };

  // Workspace Members

  addWorkspaceMember = async (
    req: AddWorkspaceMemberRequest,
    res: Response
  ) => {
    const { id: workspaceId } = req.params;
    const { userId, role } = req.body;

    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) throw new UnauthorizedError("No token provided");

    const payload = verifyToken(token);
    if (!payload) throw new UnauthorizedError("Invalid token");

    const user = await this.userService.getUserById(payload.sub);
    if (!user) throw new UnauthorizedError("User not found");

    const workspace = await this.workspaceService.getWorkspaceById(workspaceId);
    if (!workspace) throw new NotFoundError("Workspace not found");

    if (workspace.ownerId !== user.id)
      throw new UnauthorizedError("You are not the owner of this workspace");

    const member = await this.workspaceService.addUserToWorkspaceMember({
      workspaceId: workspaceId,
      userId: userId,
      role,
    });

    res.status(200).json(member);
  };

  getWorkspaceMembers = async (req: Request, res: Response) => {
    const { id } = req.params;

    const workspace = await this.workspaceService.getWorkspaceById(id);
    if (!workspace) throw new NotFoundError("Workspace not found");

    const members = await this.workspaceService.getWorkspaceMembers(id);
    res.status(200).json(members);
  };

  // Workspace Invitations

  getWorkspaceMyInvitations = async (req: Request, res: Response) => {
    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) throw new UnauthorizedError("No token provided");

    const payload = verifyToken(token);
    if (!payload) throw new UnauthorizedError("Invalid token");

    const user = await this.userService.getUserById(payload.sub);
    if (!user) throw new UnauthorizedError("User not found");

    const invitations =
      await this.workspaceService.getWorkspaceInvitationsByEmail(user.email);

    res.status(200).json(invitations);
  };

  sendWorkspaceInvitation = async (
    req: SendWorkspaceInvitationRequest,
    res: Response
  ) => {
    const { id } = req.params;
    const { email, role } = req.body;

    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) throw new UnauthorizedError("No token provided");

    const payload = verifyToken(token);
    if (!payload) throw new UnauthorizedError("Invalid token");

    const workspace = await this.workspaceService.getWorkspaceById(id);
    if (!workspace) throw new NotFoundError("Workspace not found");

    const invitedBy = await this.userService.getUserById(payload.sub);
    if (!invitedBy) throw new UnauthorizedError("User not found");

    const invitedUser = await this.userService.getUserByEmail(email);
    if (!invitedUser) throw new NotFoundError("User not found");

    if (workspace.ownerId !== invitedBy.id)
      throw new UnauthorizedError("You are not the owner of this workspace");

    // check if the invitation already exists
    const existingInvitation =
      await this.workspaceService.getWorkspaceInvitationsByEmail(email);
    if (existingInvitation.length > 0)
      throw new ConflictError("email", "Invitation already exists");

    // check if the user is already a member of the workspace
    const workspaceMembers =
      await this.workspaceService.getWorkspaceMembers(id);
    if (workspaceMembers.some((member) => member.userId === invitedUser.id))
      throw new ConflictError(
        "email",
        "User is already a member of this workspace"
      );

    const invitation = await this.workspaceService.createWorkspaceInvitation({
      workspaceId: id,
      email,
      role,
      invitedBy: invitedBy.id,
    });

    res.status(200).json(invitation);
  };

  acceptWorkspaceInvitation = async (req: Request, res: Response) => {
    const { id } = req.params;

    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) throw new UnauthorizedError("No token provided");

    const payload = verifyToken(token);
    if (!payload) throw new UnauthorizedError("Invalid token");

    // workspace invitaion exists
    const invitation =
      await this.workspaceService.getWorkspaceInvitationById(id);
    if (!invitation) throw new NotFoundError("Invitation not found");

    // check if the invitation is expired
    if (await this.workspaceService.isWorkspaceInvitationExpired(id))
      throw new BadRequestError("Invitation expired", [
        {
          field: "expiresAt",
          message: "Invitation expired",
        },
      ]);

    const user = await this.userService.getUserById(payload.sub);
    if (!user) throw new UnauthorizedError("User not found");

    // check if the user is the invited user
    if (invitation.email !== user.email)
      throw new UnauthorizedError("You are not the invited user");

    // check if the user is already a member of the workspace
    const workspaceMembers = await this.workspaceService.getWorkspaceMembers(
      invitation.workspaceId
    );
    if (workspaceMembers.some((member) => member.userId === user.id))
      throw new ConflictError(
        "email",
        "User is already a member of this workspace"
      );

    // add the user to the workspace
    await this.workspaceService.addUserToWorkspaceMember({
      workspaceId: invitation.workspaceId,
      userId: user.id,
      role: invitation.role,
    });

    // delete the invitation
    await this.workspaceService.deleteWorkspaceInvitation(id);

    res.status(200).json({ message: "Invitation accepted" });
  };

  declineWorkspaceInvitation = async (req: Request, res: Response) => {
    const { id } = req.params;

    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) throw new UnauthorizedError("No token provided");

    const payload = verifyToken(token);
    if (!payload) throw new UnauthorizedError("Invalid token");

    const user = await this.userService.getUserById(payload.sub);
    if (!user) throw new UnauthorizedError("User not found");

    const invitation =
      await this.workspaceService.getWorkspaceInvitationById(id);
    if (!invitation) throw new NotFoundError("Invitation not found");

    // check if the invitation is expired
    if (await this.workspaceService.isWorkspaceInvitationExpired(id))
      throw new BadRequestError("Invitation expired", [
        {
          field: "expiresAt",
          message: "Invitation expired",
        },
      ]);

    // check if the user is the invited user
    if (invitation.email !== user.email)
      throw new UnauthorizedError("You are not the invited user");

    await this.workspaceService.deleteWorkspaceInvitation(id);

    res.status(200).json({ message: "Invitation declined" });
  };

  removeWorkspaceInvitation = async (req: Request, res: Response) => {
    const { id } = req.params;

    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) throw new UnauthorizedError("No token provided");

    const payload = verifyToken(token);
    if (!payload) throw new UnauthorizedError("Invalid token");

    const user = await this.userService.getUserById(payload.sub);
    if (!user) throw new UnauthorizedError("User not found");

    const invitation =
      await this.workspaceService.getWorkspaceInvitationById(id);
    if (!invitation) throw new NotFoundError("Invitation not found");

    // check if the user is the owner of the workspace
    if (invitation.invitedBy !== user.id)
      throw new UnauthorizedError("You are not the owner of this workspace");

    await this.workspaceService.deleteWorkspaceInvitation(id);

    res.status(200).json({ message: "Invitation removed" });
  };
}

export default WorkspaceController;
