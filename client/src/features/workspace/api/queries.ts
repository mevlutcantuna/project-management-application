import { api } from "@/shared/lib/api";
import type { ApiResponse } from "@/shared/types/api";
import type { Workspace } from "@/shared/types/workspace";
import { useQuery } from "@tanstack/react-query";

export const useGetWorkspaceByIdQuery = (id: string) =>
  useQuery<ApiResponse<Workspace>>({
    queryKey: ["workspace", id],
    queryFn: async () => {
      const response = await api.get(`/workspaces/${id}`);
      return response.data;
    },
  });

export const useGetMyWorkspacesQuery = () =>
  useQuery<ApiResponse<Workspace[]>>({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await api.get("/workspaces");
      return response.data;
    },
  });
