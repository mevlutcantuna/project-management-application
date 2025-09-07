import { Request, Response } from "express";
import { UserService } from "@/services/user";
import { NotFoundError, ValidationError } from "@/utils/errors";
import { UpdateUserRequest } from "@/types/user";
import { updateUserSchema } from "@/schemas/user";

class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  getAllUsers = async (req: Request, res: Response) => {
    const users = await this.userService.getAllUsers();
    if (!users) throw new NotFoundError("No users found");
    res.status(200).json(users);
  };

  getUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await this.userService.getUserById(id);
    if (!user) throw new NotFoundError("User not found");
    res.status(200).json(user);
  };

  deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await this.userService.getUserById(id);
    if (!user) throw new NotFoundError("User not found");
    await this.userService.deleteUser(id);
    res.status(200).json({ message: "User deleted successfully" });
  };

  updateUser = async (req: UpdateUserRequest, res: Response) => {
    const { id } = req.params;
    const { success, data, error } = updateUserSchema.safeParse(req.body);

    if (!success) throw new ValidationError(error);

    const user = await this.userService.updateUser(id, {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      profilePicture: data.profilePicture,
    });
    res.status(200).json(user);
  };
}

export default UserController;
