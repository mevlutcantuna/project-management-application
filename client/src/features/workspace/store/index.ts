import type { Workspace, WorkspaceInvitation } from "@/shared/types/workspace";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WorkspaceState {
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (workspace: Workspace) => void;
  workspaces: Workspace[];
  setWorkspaces: (workspaces: Workspace[]) => void;
  workspaceInvitations: WorkspaceInvitation[];
  setWorkspaceInvitations: (
    workspaceInvitations: WorkspaceInvitation[]
  ) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      currentWorkspace: null,
      setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
      workspaces: [],
      setWorkspaces: (workspaces) => set({ workspaces }),
      workspaceInvitations: [],
      setWorkspaceInvitations: (workspaceInvitations) =>
        set({ workspaceInvitations }),
    }),
    { name: "workspace-storage" }
  )
);
