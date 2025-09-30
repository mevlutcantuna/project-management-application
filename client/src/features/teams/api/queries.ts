import { api } from "@/shared/lib/api";
import type { Team } from "@/shared/types/team";
import { useQuery } from "@tanstack/react-query";

export const useGetWorkspaceTeamsQuery = (
  workspaceId: string,
  options?: Omit<Parameters<typeof useQuery<Team[]>>[0], "queryKey" | "queryFn">
) => {
  return useQuery<Team[]>({
    queryKey: ["workspace-teams"],
    queryFn: async () => {
      const response = await api.get(`workspaces/${workspaceId}/teams`);
      return response.data;
    },
    ...options,
  });
};
