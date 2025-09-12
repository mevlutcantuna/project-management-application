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

  // Always wait for workspaces and workspace to be loaded
  const isLoading = useMemo(
    () => isLoadingWorkspace || isPendingWorkspaces,
    [isLoadingWorkspace, isPendingWorkspaces]
  );

  // Get stored workspace URL and find the workspace object
  const storedWorkspaceUrl = localStorage.getItem("currentWorkspace");
  const storedWorkspace = useMemo(() => {
    return workspaces.find((workspace) => workspace.url === storedWorkspaceUrl);
  }, [workspaces, storedWorkspaceUrl]);

  // Show loading screen while data is being fetched
  if (isLoading) {
    return <LoadingScreen />;
  }

  const isEmptyUrl = location.pathname === "/";
  const isWrongUrl = workspaceUrl && isErrorWorkspace;
  const hasStoredWorkspace = storedWorkspace && storedWorkspaceUrl;

  // Handle empty URL (user enters empty url)
  if (isEmptyUrl) {
    if (hasStoredWorkspace) {
      // Check stored workspace URL if it is valid, redirect to it
      return <Navigate to={`/${storedWorkspaceUrl}`} replace />;
    } else {
      // If not valid, redirect to workspaces page
      return <Navigate to="/workspaces" replace />;
    }
  }

  // Handle wrong URL (user enters wrong url)
  if (isWrongUrl) {
    if (hasStoredWorkspace) {
      // Check stored workspace URL if it is valid, redirect to it
      return <Navigate to={`/${storedWorkspaceUrl}`} replace />;
    } else {
      // If not valid, redirect to workspaces page
      return <Navigate to="/workspaces" replace />;
    }
  }

  // If we have a valid workspace URL and it's loading successfully, render the outlet
  return <Outlet />;
};

export default WorkspaceRoute;
