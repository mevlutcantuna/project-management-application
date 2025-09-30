import { create } from "zustand";
import type { Team } from "@/shared/types/team";

interface TeamState {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
}

export const useTeamStore = create<TeamState>((set) => ({
  teams: [],
  setTeams: (teams) => set({ teams }),
}));
