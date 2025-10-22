import { api } from "@/shared/lib/api";
import type { CreateTeamInput, Team } from "@/shared/types/team";
import { useMutation } from "@tanstack/react-query";

export const useCreateTeamMutation = (
  options?: Omit<
    Parameters<typeof useMutation<Team, Error, CreateTeamInput>>[0],
    "mutationFn"
  >
) => {
  return useMutation<Team, Error, CreateTeamInput>({
    mutationFn: async (team: CreateTeamInput) => {
      const response = await api.post(
        `workspaces/${team.workspaceId}/teams`,
        team
      );
      return response.data;
    },
    ...options,
  });
};
