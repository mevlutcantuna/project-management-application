import {
  useGetMyWorkspacesQuery,
  useGetWorkspaceByIdQuery,
} from "@/features/workspace/api/queries";
import { useWorkspaceStore } from "@/features/workspace/store";
import { Navigate, Outlet, useNavigate, useParams } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";
import { useEffect } from "react";

const WorkspaceProvider = () => {
  const { currentWorkspace, setCurrentWorkspace, setWorkspaces } =
    useWorkspaceStore();
  const { workspaceId } = useParams();
  const {
    data: workspace = null,
    isPending: isPendingWorkspace,
    isError: isErrorWorkspace,
  } = useGetWorkspaceByIdQuery(workspaceId ?? "");
  const { data: allWorkspaces } = useGetMyWorkspacesQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (workspace) {
      setCurrentWorkspace(workspace);
    }
  }, [workspace, setCurrentWorkspace]);

  useEffect(() => {
    if (allWorkspaces && allWorkspaces.length > 0) {
      setWorkspaces(allWorkspaces);
    }
  }, [allWorkspaces, setWorkspaces]);

  useEffect(() => {
    if (isErrorWorkspace) {
      setCurrentWorkspace(null);
      navigate("/");
    }
  }, [isErrorWorkspace, navigate, setCurrentWorkspace]);

  if (isPendingWorkspace) {
    return <LoadingScreen />;
  }

  if (isErrorWorkspace && currentWorkspace) {
    return <Navigate to={`/${currentWorkspace.id}`} />;
  }

  return <Outlet />;
};

export default WorkspaceProvider;
