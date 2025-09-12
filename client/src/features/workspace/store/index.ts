import type { Workspace, WorkspaceInvitation } from "@/shared/types/workspace";
import { create } from "zustand";

interface WorkspaceState {
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  workspaces: Workspace[];
  setWorkspaces: (workspaces: Workspace[]) => void;
  workspaceInvitations: WorkspaceInvitation[];
  setWorkspaceInvitations: (
    workspaceInvitations: WorkspaceInvitation[]
  ) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()((set) => ({
  currentWorkspace: null,
  setCurrentWorkspace: (workspace) => {
    set({ currentWorkspace: workspace });
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
}));
