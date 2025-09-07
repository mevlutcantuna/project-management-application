import { api } from "@/shared/lib/api";
import type { Workspace } from "@/shared/types/workspace";
import { useMutation } from "@tanstack/react-query";

export interface CreateWorkspaceInput {
  name: string;
  description: string;
}

export const useCreateWorkspaceMutation = (
  options?: Omit<
    Parameters<typeof useMutation<Workspace, Error, CreateWorkspaceInput>>[0],
    "mutationFn"
  >
) => {
  return useMutation({
    mutationFn: async (workspace: CreateWorkspaceInput) => {
      const response = await api.post("/workspaces", workspace);
      return response.data;
    },
    ...options,
  });
};

export interface UpdateWorkspaceInput {
  id: string;
  name: string;
  description: string;
}

export const useUpdateWorkspaceMutation = () => {
  return useMutation({
    mutationFn: async (workspace: UpdateWorkspaceInput) => {
      const response = await api.put(`/workspaces/${workspace.id}`, workspace);
      return response.data;
    },
  });
};
