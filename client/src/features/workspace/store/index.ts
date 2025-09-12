import type { Workspace, WorkspaceInvitation } from "@/shared/types/workspace";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface WorkspaceState {
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (
    workspace: Workspace | null,
    updateLocalStorage?: boolean
  ) => void;
  workspaces: Workspace[];
  setWorkspaces: (workspaces: Workspace[]) => void;
  workspaceInvitations: WorkspaceInvitation[];
  setWorkspaceInvitations: (
    workspaceInvitations: WorkspaceInvitation[]
  ) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  devtools((set) => ({
    currentWorkspace: null,
    setCurrentWorkspace: (workspace, willUpdateLocalStorage = true) => {
      set({ currentWorkspace: workspace });

      // if willUpdateLocalStorage is false, don't update the localStorage
      if (!willUpdateLocalStorage) return;

      if (workspace) {
        localStorage.setItem("currentWorkspace", workspace.url);
      } else {
        localStorage.removeItem("currentWorkspace");
      }
    },
    workspaces: [],
    setWorkspaces: (workspaces) => set({ workspaces }),
    workspaceInvitations: [],
    setWorkspaceInvitations: (workspaceInvitations) =>
      set({ workspaceInvitations }),
  }))
);
