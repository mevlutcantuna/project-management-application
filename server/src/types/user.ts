import { Request } from "express";

export type UserRole = "Admin" | "Manager" | "Member";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  passwordHash: string;
  profilePicture: string | null;
}

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePicture?: string;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  profilePicture?: string;
}

export interface UpdateUserRequest extends Request {
  params: {
    id: string;
  };
  body: {
    firstName?: string;
    lastName?: string;
    email?: string;
    profilePicture?: string;
  };
}
