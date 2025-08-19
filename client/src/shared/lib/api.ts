import axios from "axios";
import { jwtDecode } from "jwt-decode";
import cookie from "js-cookie";
import type { DecodedUser } from "../types/user";

export const BASE_URL = import.meta.env.VITE_API_URL;

console.log(BASE_URL);

export const api = axios.create({
  baseURL: BASE_URL,
});

export const uninterceptedApi = axios.create({
  baseURL: BASE_URL,
});

export function decodeJWT(token: string): DecodedUser {
  try {
    const decoded = jwtDecode<DecodedUser>(token);
    return decoded;
  } catch (error) {
    console.warn(error);
    return {} as DecodedUser;
  }
}

export function getAccessToken(): string | undefined {
  return cookie.get("access_token");
}

export function getRefreshToken(): string | undefined {
  return cookie.get("refresh_token");
}

export function isTokenExpired(): boolean {
  const expiry = cookie.get("token_expiry");
  if (!expiry) return true;
  return Date.now() > Number(expiry) * 1000;
}

export function clearTokens(): void {
  cookie.remove("access_token");
  cookie.remove("refresh_token");
  cookie.remove("token_expiry");
}

api.interceptors.request.use(
  async (config) => {
    if (isTokenExpired()) {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const response = await uninterceptedApi.post("/auth/refresh", {
            refresh_token: refreshToken,
          });
          const { accessToken, expiresIn } = response.data;
          cookie.set("access_token", accessToken);
          cookie.set(
            "token_expiry",
            ((Date.now() + expiresIn * 1000) / 1000).toString()
          );
        } catch (error) {
          clearTokens();
          window.location.href = "/login";
          return Promise.reject(error);
        }
      } else {
        clearTokens();
        window.location.href = "/login";
        return Promise.reject("No refresh token available");
      }
    }

    const token = getAccessToken();

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
