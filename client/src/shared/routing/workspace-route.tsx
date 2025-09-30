import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { useMemo, type ReactElement } from "react";
import { useWorkspaceStore } from "@/features/workspace/store";
import { useWorkspaces } from "../hooks/use-workspaces";
import { useWorkspace } from "../hooks/use-workspace";
import LoadingScreen from "@/components/common/loading/loading-screen";
import { useTeams } from "../hooks/use-teams";

const WorkspaceRoute = (): ReactElement => {
  const location = useLocation();
  const { workspaceUrl = "" } = useParams<{ workspaceUrl: string }>();
  const { workspaces } = useWorkspaceStore();
  const { isLoading: isLoadingWorkspace, isError: isErrorWorkspace } =
    useWorkspace(workspaceUrl);
  const { isPending: isPendingWorkspaces } = useWorkspaces();
  const storedWorkspaceUrl = localStorage.getItem("currentWorkspace");
  const { isLoading: isLoadingTeams } = useTeams();

  const isLoading = useMemo(
    () => isLoadingWorkspace || isPendingWorkspaces || isLoadingTeams,
    [isLoadingWorkspace, isPendingWorkspaces, isLoadingTeams]
  );

  const storedWorkspace = useMemo(() => {
    return workspaces.find((workspace) => workspace.url === storedWorkspaceUrl);
  }, [workspaces, storedWorkspaceUrl]);

  const fallbackRedirectUrl = useMemo(() => {
    if (storedWorkspace) {
      return `/${storedWorkspaceUrl}`;
    } else {
      return "/workspaces";
    }
  }, [storedWorkspace, storedWorkspaceUrl]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (location.pathname === "/") {
    return <Navigate to={fallbackRedirectUrl} replace />;
  }

  if (workspaceUrl && isErrorWorkspace) {
    return <Navigate to={fallbackRedirectUrl} replace />;
  }

  return <Outlet />;
};

export default WorkspaceRoute;
