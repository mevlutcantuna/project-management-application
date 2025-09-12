import { api } from "@/shared/lib/api";
import type { Workspace } from "@/shared/types/workspace";
import { useQuery } from "@tanstack/react-query";

export const useGetWorkspaceByUrlQuery = (
  url: string,
  options?: Omit<
    Parameters<typeof useQuery<Workspace>>[0],
    "queryKey" | "queryFn"
  >
) =>
  useQuery<Workspace>({
    queryKey: ["workspace", url],
    queryFn: async () => {
      const response = await api.get(`/workspaces/by-url/${url}`);
      return response.data;
    },
    ...options,
  });

export const useGetWorkspaceByIdQuery = (
  id: string,
  options?: Omit<
    Parameters<typeof useQuery<Workspace>>[0],
    "queryKey" | "queryFn"
  >
) =>
  useQuery<Workspace>({
    queryKey: ["workspace", id],
    queryFn: async () => {
      const response = await api.get(`/workspaces/${id}`);
      return response.data;
    },
    ...options,
  });

export const useGetMyWorkspacesQuery = (
  options?: Omit<
    Parameters<typeof useQuery<Workspace[]>>[0],
    "queryKey" | "queryFn"
  >
) =>
  useQuery<Workspace[]>({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await api.get("/workspaces");
      return response.data;
    },
    ...options,
  });
