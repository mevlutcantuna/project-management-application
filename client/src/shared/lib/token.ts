import cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import type { DecodedUser } from "../types/user";

export class TokenService {
  public decodeToken(token: string) {
    try {
      const decoded = jwtDecode<DecodedUser>(token);
      return decoded;
    } catch (error) {
      console.warn(error);
      return {} as DecodedUser;
    }
  }

  public getAccessToken() {
    return cookie.get("access_token");
  }

  public getRefreshToken() {
    return cookie.get("refresh_token");
  }

  public setAccessToken(token: string) {
    cookie.set("access_token", token);
  }

  public setRefreshToken(token: string) {
    cookie.set("refresh_token", token);
  }

  public setTokenExpiry(expiry: number) {
    cookie.set("token_expiry", expiry.toString());
  }

  public removeAccessToken() {
    cookie.remove("access_token");
  }

  public removeRefreshToken() {
    cookie.remove("refresh_token");
  }

  public removeTokenExpiry() {
    cookie.remove("token_expiry");
  }

  public removeTokens() {
    cookie.remove("access_token");
    cookie.remove("refresh_token");
    cookie.remove("token_expiry");
  }

  public getAuthHeader() {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  public isAccessTokenExpired() {
    try {
      const token = this.getAccessToken();
      if (!token) return true;
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return decoded.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  }

  public isRefreshTokenExpired() {
    try {
      const token = this.getRefreshToken();
      if (!token) return true;
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return decoded.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  }
}
