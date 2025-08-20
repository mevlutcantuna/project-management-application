export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  full_name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  id: string;
  full_name: string;
  email: string;
  createdAt: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}
