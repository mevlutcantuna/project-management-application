import { uninterceptedApi } from "@/shared/lib/api";
import { useMutation } from "@tanstack/react-query";
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from "./types";
import cookie from "js-cookie";

export const useLoginMutation = (
  options?: Omit<Parameters<typeof useMutation>[0], "mutationFn">
) => {
  const { onSuccess, onError } = options || {};

  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<LoginResponse> => {
      const response = await uninterceptedApi.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data, ...others) => {
      cookie.set("access_token", data.access_token);
      cookie.set("refresh_token", data.refresh_token);
      cookie.set("token_expiry", data.expires_in.toString());
      onSuccess?.(data, ...others);
    },
    onError: (error, ...others) => {
      console.error("Login failed:", error);
      onError?.(error, ...others);
    },
    ...options,
  });
};

export const useSignupMutation = (
  options?: Omit<Parameters<typeof useMutation>[0], "mutationFn">
) => {
  return useMutation({
    mutationFn: async (credentials: SignupRequest): Promise<SignupResponse> => {
      const response = await uninterceptedApi.post("/auth/signup", credentials);
      return response.data;
    },
    ...options,
  });
};
