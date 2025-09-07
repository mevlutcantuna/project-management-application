import { Request } from "express";
import { User } from "./user";

export interface SignupRequest extends Request {
  body: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
}

export interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export interface RefreshTokenRequest extends Request {
  body: {
    token: string;
  };
}

export type GetMeRequest = Request;

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: Omit<User, "passwordHash">;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
