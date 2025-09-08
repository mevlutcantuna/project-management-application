import { TokenService } from "@/shared/lib/token";
import type { User } from "@/shared/types/user";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  token: null,
  isAuthenticated: false,
  login: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => {
    const { removeTokens } = new TokenService();
    removeTokens();
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
