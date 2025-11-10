import { api } from "@/shared/lib/api";
import type { Team } from "@/shared/types/team";
import { useQuery } from "@tanstack/react-query";

export const useGetWorkspaceTeamsQuery = (
  workspaceId: string,
  options?: Omit<Parameters<typeof useQuery<Team[]>>[0], "queryKey" | "queryFn">
) => {
  return useQuery<Team[]>({
    queryKey: ["workspace-teams", workspaceId],
    queryFn: async () => {
      const response = await api.get(`workspaces/${workspaceId}/teams`);
      return response.data;
    },
    ...options,
  });
};

export const useGetTeamByIdentifierQuery = (
  identifier: string,
  workspaceId: string,
  options?: Omit<Parameters<typeof useQuery<Team>>[0], "queryKey" | "queryFn">
) => {
  return useQuery<Team>({
    queryKey: ["team-by-identifier", identifier, workspaceId],
    queryFn: async () => {
      const response = await api.get(
        `workspaces/${workspaceId}/teams/by-identifier/${identifier}`
      );
      return response.data;
    },
    ...options,
  });
};
