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
  const { workspaceId = "" } = useParams<{ workspaceId: string }>();

  const { currentWorkspace, workspaces } = useWorkspaceStore();
  const { isLoading: isLoadingWorkspace, isError: isErrorWorkspace } =
    useWorkspace(workspaceId);
  const { isPending: isPendingWorkspaces } = useWorkspaces();
  const storedWorkspaceId = localStorage.getItem("currentWorkspace");

  const isLoading = useMemo(
    () => isLoadingWorkspace || isPendingWorkspaces,
    [isLoadingWorkspace, isPendingWorkspaces]
  );

  useEffect(() => {
    if (!isLoading && location.pathname === "/" && workspaces.length > 0) {
      const isExistingWorkspace = workspaces.some(
        (workspace) => workspace.id === storedWorkspaceId
      );

      if (isExistingWorkspace) {
        navigate(`/${storedWorkspaceId}`);
      } else {
        navigate("/workspaces");
      }
    }
  }, [
    currentWorkspace,
    navigate,
    location.pathname,
    workspaces,
    storedWorkspaceId,
    isLoading,
    workspaces.length,
  ]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isErrorWorkspace && currentWorkspace) {
    return <Navigate to={`/${currentWorkspace.id}`} replace />;
  }

  return <Outlet />;
};

export default WorkspaceRoute;
