import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useEffect, useMemo, type ReactElement } from "react";

import LoadingScreen from "@/components/LoadingScreen";
import { useWorkspaceStore } from "@/features/workspace/store";
import { useWorkspaces } from "../hooks/useWorkspaces";
import { useWorkspace } from "../hooks/useWorkspace";

const WorkspaceRoute = (): ReactElement => {
  const navigate = useNavigate();
  const location = useLocation();
  const { workspaceUrl = "" } = useParams<{ workspaceUrl: string }>();

  const { currentWorkspace, workspaces } = useWorkspaceStore();
  const { isLoading: isLoadingWorkspace, isError: isErrorWorkspace } =
    useWorkspace(workspaceUrl);
  const { isPending: isPendingWorkspaces } = useWorkspaces();
  const storedWorkspaceUrl = localStorage.getItem("currentWorkspace");

  const isLoading = useMemo(
    () => isLoadingWorkspace || isPendingWorkspaces,
    [isLoadingWorkspace, isPendingWorkspaces]
  );

  useEffect(() => {
    if (!isLoading && location.pathname === "/" && workspaces.length > 0) {
      const isExistingWorkspace = workspaces.some(
        (workspace) => workspace.url === storedWorkspaceUrl
      );

      if (isExistingWorkspace) {
        navigate(`/${storedWorkspaceUrl}`);
      } else {
        navigate("/workspaces");
      }
    }
  }, [
    currentWorkspace,
    navigate,
    location.pathname,
    workspaces,
    storedWorkspaceUrl,
    isLoading,
    workspaces.length,
  ]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isErrorWorkspace && currentWorkspace) {
    return <Navigate to={`/${currentWorkspace.url}`} replace />;
  }

  if (isErrorWorkspace && !currentWorkspace && workspaces.length > 0) {
    return <Navigate to={`/${workspaces[0].url}`} replace />;
  }

  if (isErrorWorkspace && !currentWorkspace && workspaces.length === 0) {
    return <Navigate to="/workspaces" replace />;
  }

  return <Outlet />;
};

export default WorkspaceRoute;
