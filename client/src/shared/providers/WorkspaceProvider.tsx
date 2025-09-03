import {
  useGetMyWorkspacesQuery,
  useGetWorkspaceByIdQuery,
} from "@/features/workspace/api/queries";
import { useWorkspaceStore } from "@/features/workspace/store";
import { Navigate, Outlet, useNavigate, useParams } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";
import { useEffect, useMemo } from "react";

const WorkspaceProvider = () => {
  const { currentWorkspace, setCurrentWorkspace, setWorkspaces } =
    useWorkspaceStore();
  const { workspaceId } = useParams();
  const {
    data: workspaceData = null,
    isPending: isPendingWorkspace,
    isError: isErrorWorkspace,
  } = useGetWorkspaceByIdQuery(workspaceId ?? "");
  const { data: allWorkspacesData } = useGetMyWorkspacesQuery();
  const navigate = useNavigate();

  const workspace = useMemo(() => workspaceData?.data ?? null, [workspaceData]);
  const allWorkspaces = useMemo(
    () => allWorkspacesData?.data ?? [],
    [allWorkspacesData]
  );

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
    if (isErrorWorkspace) navigate("/");
  }, [isErrorWorkspace, navigate]);

  if (isPendingWorkspace) {
    return <LoadingScreen />;
  }

  if (currentWorkspace) {
    return <Navigate to={`/${currentWorkspace.id}`} />;
  }

  return <Outlet />;
};

export default WorkspaceProvider;
