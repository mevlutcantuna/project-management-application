import { Request, Response } from "express";
import { WorkspaceService } from "@/services/workspace";
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

  private async ensureWorkspaceMember(workspaceId: string, userId: string) {
    const workspaceMembers =
      await this.workspaceService.getWorkspaceMembers(workspaceId);
    if (!workspaceMembers.some((member) => member.userId === userId))
      throw new UnauthorizedError("You are not a member of this workspace");
  }

  private async ensureWorkspaceOwner(workspaceId: string, userId: string) {
    const workspace = await this.workspaceService.getWorkspaceById(workspaceId);
    if (!workspace) throw new NotFoundError("Workspace not found");

    if (workspace.ownerId !== userId)
      throw new UnauthorizedError("You are not the owner of this workspace");

    return workspace;
  }

  private async ensureWorkspaceAdminOrManager(
    workspaceId: string,
    userId: string
  ) {
    const workspaceMembers =
      await this.workspaceService.getWorkspaceMembers(workspaceId);
    if (!workspaceMembers.some((member) => member.userId === userId))
      throw new UnauthorizedError("You are not a member of this workspace");

    const member = workspaceMembers.find((member) => member.userId === userId);
    if (member && member.role !== "Admin" && member.role !== "Manager")
      throw new UnauthorizedError(
        "You are not the admin or manager of this workspace"
      );
  }

  // Workspaces

  createWorkspace = async (req: CreateWorkspaceRequest, res: Response) => {
    const validatedData = createWorkspaceSchema.safeParse(req.body);
    if (!validatedData.success) throw new ValidationError(validatedData.error);

    const { name, description = "", url } = validatedData.data;

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
      ownerId: req.user.id,
      url: url.toLowerCase().trim(),
    });

    res.status(201).json(workspace);
  };

  getWorkspaceById = async (req: Request, res: Response) => {
    const { id } = req.params;

    await this.ensureWorkspaceMember(id, req.user.id);

    const workspace = await this.workspaceService.getWorkspaceById(id);
    if (!workspace) throw new NotFoundError("Workspace not found");

    res.status(200).json(workspace);
  };

  getWorkspaceByUrl = async (req: Request, res: Response) => {
    const { url } = req.params;

    const workspaceByUrl = await this.workspaceService.getWorkspaceByUrl(url);
    if (!workspaceByUrl) throw new NotFoundError("Workspace not found");

    await this.ensureWorkspaceMember(workspaceByUrl.id, req.user.id);

    res.status(200).json(workspaceByUrl);
  };

  getMyWorkspaces = async (req: Request, res: Response) => {
    const workspaces = await this.workspaceService.getWorkspacesByUserId(
      req.user.id
    );
    res.status(200).json(workspaces);
  };

  updateWorkspace = async (req: UpdateWorkspaceRequest, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;

    await this.ensureWorkspaceOwner(id, req.user.id);

    const updatedWorkspace = await this.workspaceService.updateWorkspace({
      id: id,
      name,
      description,
    });

    res.status(200).json(updatedWorkspace);
  };

  deleteWorkspace = async (req: Request, res: Response) => {
    const { id } = req.params;

    await this.ensureWorkspaceOwner(id, req.user.id);

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

    await this.ensureWorkspaceOwner(workspaceId, req.user.id);

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
    const invitations =
      await this.workspaceService.getWorkspaceInvitationsByEmail(
        req.user.email
      );

    res.status(200).json(invitations);
  };

  sendWorkspaceInvitation = async (
    req: SendWorkspaceInvitationRequest,
    res: Response
  ) => {
    const { id } = req.params;
    const { email, role } = req.body;

    const workspace = await this.workspaceService.getWorkspaceById(id);
    if (!workspace) throw new NotFoundError("Workspace not found");

    const senderMember = await this.workspaceService.getWorkspaceMemberByUserId(
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
      invitedBy: req.user.id,
    });

    res.status(200).json(invitation);
  };

  acceptWorkspaceInvitation = async (req: Request, res: Response) => {
    const { id } = req.params;

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

    // check if the user is the invited user
    if (invitation.email !== req.user.email)
      throw new UnauthorizedError("You are not the invited user");

    // check if the user is already a member of the workspace
    const workspaceMembers = await this.workspaceService.getWorkspaceMembers(
      invitation.workspaceId
    );
    if (workspaceMembers.some((member) => member.userId === req.user.id))
      throw new ConflictError(
        "email",
        "User is already a member of this workspace"
      );

    // add the user to the workspace
    await this.workspaceService.addUserToWorkspaceMember({
      workspaceId: invitation.workspaceId,
      userId: req.user.id,
      role: invitation.role,
    });

    // delete the invitation
    await this.workspaceService.deleteWorkspaceInvitation(id);

    res.status(200).json({ message: "Invitation accepted" });
  };

  declineWorkspaceInvitation = async (req: Request, res: Response) => {
    const { id } = req.params;

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
    if (invitation.email !== req.user.email)
      throw new UnauthorizedError("You are not the invited user");

    await this.workspaceService.deleteWorkspaceInvitation(id);

    res.status(200).json({ message: "Invitation declined" });
  };

  removeWorkspaceInvitation = async (req: Request, res: Response) => {
    const { id } = req.params;

    const invitation =
      await this.workspaceService.getWorkspaceInvitationById(id);
    if (!invitation) throw new NotFoundError("Invitation not found");

    // check if the user is the owner of the workspace
    if (invitation.invitedBy !== req.user.id)
      throw new UnauthorizedError("You are not the owner of this workspace");

    await this.workspaceService.deleteWorkspaceInvitation(id);

    res.status(200).json({ message: "Invitation removed" });
  };

  // Workspace Statuses

  getWorkspaceStatuses = async (req: Request, res: Response) => {
    const { id } = req.params;

    await this.ensureWorkspaceMember(id, req.user.id);

    const statuses = await this.workspaceService.getWorkspaceStatuses(id);
    res.status(200).json(statuses);
  };

  createWorkspaceStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, iconName, color } = req.body;

    await this.ensureWorkspaceMember(id, req.user.id);

    const status = await this.workspaceService.createWorkspaceStatus({
      workspaceId: id,
      name,
      iconName,
      color,
      createdById: req.user.id,
    });

    res.status(200).json(status);
  };

  updateWorkspaceStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, iconName, color } = req.body;

    await this.ensureWorkspaceAdminOrManager(id, req.user.id);

    // Check the status already exists
    const existingStatus =
      await this.workspaceService.getWorkspaceStatusById(id);
    if (!existingStatus) throw new NotFoundError("Status not found");

    const status = await this.workspaceService.updateWorkspaceStatus({
      id,
      name,
      iconName,
      color,
    });

    res.status(200).json(status);
  };

  deleteWorkspaceStatus = async (req: Request, res: Response) => {
    const { id } = req.params;

    await this.ensureWorkspaceAdminOrManager(id, req.user.id);

    await this.workspaceService.deleteWorkspaceStatus(id);

    res.status(200).json({ message: "Workspace status deleted" });
  };
}

export default WorkspaceController;
