import { Request, Response } from "express";
import { WorkspaceService } from "@/services/workspace";
import { extractTokenFromHeader, verifyToken } from "@/utils/jwt";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@/utils/errors";
import { UserService } from "@/services/user";
import {
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  AddWorkspaceMemberRequest,
  SendWorkspaceInvitationRequest,
} from "@/types/workspace";
import { createWorkspaceSchema } from "@/schemas/workspace";

class WorkspaceController {
  private workspaceService: WorkspaceService;
  private userService: UserService;

  constructor(workspaceService: WorkspaceService, userService: UserService) {
    this.workspaceService = workspaceService;
    this.userService = userService;
  }

  // Workspaces

  createWorkspace = async (req: CreateWorkspaceRequest, res: Response) => {
    const {
      name,
      description = "",
      url,
    } = createWorkspaceSchema.parse(req.body);

    const validatedData = createWorkspaceSchema.safeParse(req.body);
    if (!validatedData.success) throw new ValidationError(validatedData.error);

    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) throw new UnauthorizedError("No token provided");

    const payload = verifyToken(token);
    if (!payload) throw new UnauthorizedError("Invalid token");

    const user = await this.userService.getUserById(payload.sub);
    if (!user) throw new UnauthorizedError("User not found");

    // check if the workspace url already exists
    const existingWorkspaceByUrl =
      await this.workspaceService.getWorkspaceByUrl(url);
    if (existingWorkspaceByUrl)
      throw new ConflictError("url", "Workspace url already exists");

    // Check if the workspace name already exists for the user
    const existingWorkspaceByName =
      await this.workspaceService.getWorkspaceByName(name);
    if (existingWorkspaceByName)
      throw new ConflictError("name", "Workspace name already exists");

    const workspace = await this.workspaceService.createWorkspace({
      name,
      description,
      ownerId: user.id,
      url: url.toLowerCase().trim(),
    });

    res.status(201).json(workspace);
  };

  getWorkspaceById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) throw new UnauthorizedError("No token provided");

    const payload = verifyToken(token);
    if (!payload) throw new UnauthorizedError("Invalid token");

    const user = await this.userService.getUserById(payload.sub);
    if (!user) throw new UnauthorizedError("User not found");

    // check user is a member or the owner of the workspace
    const workspaceMembers =
      await this.workspaceService.getWorkspaceMembers(id);
    if (!workspaceMembers.some((member) => member.userId === user.id))
      throw new UnauthorizedError("You are not a member of this workspace");

    const workspace = await this.workspaceService.getWorkspaceById(id);
    if (!workspace) throw new NotFoundError("Workspace not found");

    res.status(200).json(workspace);
  };

  getWorkspaceByUrl = async (req: Request, res: Response) => {
    const { url } = req.params;

    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) throw new UnauthorizedError("No token provided");

    const payload = verifyToken(token);
    if (!payload) throw new UnauthorizedError("Invalid token");

    const user = await this.userService.getUserById(payload.sub);
    if (!user) throw new UnauthorizedError("User not found");

    const workspaceByUrl = await this.workspaceService.getWorkspaceByUrl(url);
    if (!workspaceByUrl) throw new NotFoundError("Workspace not found");

    // check user is a member or the owner of the workspace
    const workspaceMembers = await this.workspaceService.getWorkspaceMembers(
      workspaceByUrl.id
    );
    if (!workspaceMembers.some((member) => member.userId === user.id))
      throw new UnauthorizedError("You are not a member of this workspace");

    const workspace = await this.workspaceService.getWorkspaceByUrl(url);
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
    const { name, description } = req.body;

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
      name,
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

    const sender = await this.userService.getUserById(payload.sub);
    if (!sender) throw new UnauthorizedError("Sender user not found");

    const senderMember = await this.workspaceService.getWorkspaceMemberByUserId(
      sender.id,
      workspace.id
    );
    if (!senderMember) throw new UnauthorizedError("Sender user not found");

    const receiver = await this.userService.getUserByEmail(email);
    if (!receiver) throw new NotFoundError("Receiver user not found");

    if (sender.id === receiver.id)
      throw new ConflictError("email", "You cannot invite yourself");

    // Check if invited by has a valid role such as Admin or Manager
    if (senderMember.role !== "Admin" && senderMember.role !== "Manager")
      throw new UnauthorizedError("You are not authorized to invite users");

    // check if the invitation already exists
    const existingInvitation =
      await this.workspaceService.getWorkspaceInvitationsByEmail(email);
    if (existingInvitation.length > 0)
      throw new ConflictError("email", "Invitation already exists");

    // check if the user is already a member of the workspace
    const workspaceMembers =
      await this.workspaceService.getWorkspaceMembers(id);
    if (workspaceMembers.some((member) => member.userId === receiver.id))
      throw new ConflictError(
        "email",
        "User is already a member of this workspace"
      );

    const invitation = await this.workspaceService.createWorkspaceInvitation({
      workspaceId: id,
      email,
      role,
      invitedBy: sender.id,
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
