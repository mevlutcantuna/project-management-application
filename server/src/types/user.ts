import { Request } from "express";

export type UserRole = "admin" | "manager" | "member";

export interface User {
  id: string;
  fullName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  passwordHash: string;
  profilePicture: string | null;
}

export interface CreateUserInput {
  fullName: string;
  email: string;
  password: string;
  profilePicture?: string;
}

export interface UpdateUserInput {
  fullName?: string;
  email?: string;
  profilePicture?: string;
}

export interface UpdateUserRequest extends Request {
  params: {
    id: string;
  };
  body: {
    fullName?: string;
    email?: string;
    profilePicture?: string;
  };
}
