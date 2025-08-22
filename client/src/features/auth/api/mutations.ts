import { uninterceptedApi } from "@/shared/lib/api";
import { useMutation } from "@tanstack/react-query";
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from "./types";
import { TokenService } from "@/shared/lib/token";

export const useLoginMutation = (
  options?: Omit<Parameters<typeof useMutation>[0], "mutationFn">
) => {
  const { onSuccess } = options || {};

  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<LoginResponse> => {
      const response = await uninterceptedApi.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data, ...others) => {
      const { setAccessToken, setRefreshToken, setTokenExpiry } =
        new TokenService();

      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
      setTokenExpiry(data.expires_in);
      onSuccess?.(data, ...others);
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
