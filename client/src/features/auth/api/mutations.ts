import { uninterceptedApi } from "@/shared/lib/api";
import { useMutation } from "@tanstack/react-query";
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from "./types";

export const useLoginMutation = (
  options?: Omit<
    Parameters<typeof useMutation<LoginResponse, Error, LoginRequest>>[0],
    "mutationFn"
  >
) => {
  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<LoginResponse> => {
      const response = await uninterceptedApi.post("/auth/login", credentials);
      return response.data;
    },
    ...options,
  });
};

export const useSignupMutation = (
  options?: Omit<
    Parameters<typeof useMutation<SignupResponse, Error, SignupRequest>>[0],
    "mutationFn"
  >
) => {
  return useMutation({
    mutationFn: async (credentials: SignupRequest): Promise<SignupResponse> => {
      const response = await uninterceptedApi.post("/auth/signup", credentials);
      return response.data;
    },
    ...options,
  });
};
