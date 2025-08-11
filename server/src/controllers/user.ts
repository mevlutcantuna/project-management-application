import { Request, Response } from "express";
import { UserService } from "@/services/user";
import { db } from "@/config/dbClient";
import { NotFoundError } from "@/utils/errors";

const userService = new UserService(db);

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  if (!users) throw new NotFoundError("No users found");
  res.status(200).json(users);
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);
  if (!user) throw new NotFoundError("User not found");
  res.status(200).json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);
  if (!user) throw new NotFoundError("User not found");
  await userService.deleteUser(id);
  res.status(200).json({ message: "User deleted" });
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { full_name, username, email, workspace_ids } = req.body;

  const user = await userService.updateUser(id, {
    full_name,
    username,
    email,
    workspace_ids,
  });

  res.status(200).json(user);
};
