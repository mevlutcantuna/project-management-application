import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { useMemo, type ReactElement } from "react";
import { useWorkspaceStore } from "@/features/workspace/store";
import { useWorkspaces } from "../hooks/useWorkspaces";
import { useWorkspace } from "../hooks/useWorkspace";
import LoadingScreen from "@/components/LoadingScreen";

const WorkspaceRoute = (): ReactElement => {
  const location = useLocation();
  const { workspaceUrl = "" } = useParams<{ workspaceUrl: string }>();
  const { workspaces } = useWorkspaceStore();
  const { isLoading: isLoadingWorkspace, isError: isErrorWorkspace } =
    useWorkspace(workspaceUrl);
  const { isPending: isPendingWorkspaces } = useWorkspaces();
  const storedWorkspaceUrl = localStorage.getItem("currentWorkspace");

  const isLoading = useMemo(
    () => isLoadingWorkspace || isPendingWorkspaces,
    [isLoadingWorkspace, isPendingWorkspaces]
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
