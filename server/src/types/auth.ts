import { Request } from "express";

export interface SignupRequest extends Request {
  body: {
    fullName: string;
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

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
