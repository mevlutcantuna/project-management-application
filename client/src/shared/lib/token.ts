import cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import type { DecodedUser } from "../types/user";

export const TokenService = {
  decodeToken: (token: string) => {
    try {
      const decoded = jwtDecode<DecodedUser>(token);
      return decoded;
    } catch (error) {
      console.warn(error);
      return {} as DecodedUser;
    }
  },

  getAccessToken: () => {
    return cookie.get("access_token");
  },

  getRefreshToken: () => {
    return cookie.get("refresh_token");
  },

  getTokenExpiry: () => {
    return parseInt(cookie.get("token_expiry") as string);
  },

  setAccessToken: (token: string) => {
    cookie.set("access_token", token);
  },

  setRefreshToken: (token: string) => {
    cookie.set("refresh_token", token);
  },

  setTokenExpiry: (expiry: number) => {
    cookie.set("token_expiry", expiry.toString(), { expires: 7 });
  },

  removeAccessToken: () => {
    cookie.remove("access_token");
  },

  removeRefreshToken: () => {
    cookie.remove("refresh_token");
  },

  removeTokenExpiry: () => {
    cookie.remove("token_expiry");
  },

  removeTokens: () => {
    cookie.remove("access_token");
    cookie.remove("refresh_token");
    cookie.remove("token_expiry");
  },

  getAuthHeader: () => {
    const token = TokenService.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  isTokenExpired: () => {
    return TokenService.getTokenExpiry() * 1000 < Date.now();
  },
};
