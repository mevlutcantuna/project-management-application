import axios from "axios";
import { TokenService } from "./token";

export const BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: BASE_URL,
});

export const uninterceptedApi = axios.create({
  baseURL: BASE_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const { getAccessToken } = new TokenService();

    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  async (config) => {
    const {
      isAccessTokenExpired,
      getRefreshToken,
      setAccessToken,
      removeTokens,
    } = new TokenService();

    if (isAccessTokenExpired()) {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const response = await uninterceptedApi.get("/auth/refresh", {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          });
          const { accessToken } = response.data;
          setAccessToken(accessToken);
        } catch (error) {
          removeTokens();
          window.location.href = "/login";
          return Promise.reject(error);
        }
      } else {
        removeTokens();
        window.location.href = "/login";
        return Promise.reject("No refresh token available");
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
