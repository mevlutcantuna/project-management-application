import { api } from "@/shared/lib/api";
import type { Workspace } from "@/shared/types/workspace";
import { useQuery } from "@tanstack/react-query";

export const useGetWorkspaceByIdQuery = (id: string) =>
  useQuery<Workspace>({
    queryKey: ["workspace", id],
    queryFn: async () => {
      const response = await api.get(`/workspaces/${id}`);
      return response.data;
    },
  });

export const useGetMyWorkspacesQuery = () =>
  useQuery<Workspace[]>({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await api.get("/workspaces");
      return response.data;
    },
  });
