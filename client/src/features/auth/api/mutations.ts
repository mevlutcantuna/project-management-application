import { uninterceptedApi } from "@/shared/lib/api";
import { useMutation } from "@tanstack/react-query";
import type { LoginRequest, LoginResponse } from "./types";
import cookie from "js-cookie";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<LoginResponse> => {
      const response = await uninterceptedApi.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      cookie.set("access_token", data.accessToken);
      cookie.set("refresh_token", data.refreshToken);
      cookie.set(
        "token_expiry",
        ((Date.now() + data.expiresIn * 1000) / 1000).toString()
      );
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};
