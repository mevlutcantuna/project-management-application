import { useGetMyWorkspacesQuery } from "@/features/workspace/api/queries";
import { useWorkspaceStore } from "@/features/workspace/store";
import { useEffect } from "react";

export const useWorkspaces = () => {
  const { workspaces, setWorkspaces } = useWorkspaceStore();
  const { data, isPending, isLoading, isError } = useGetMyWorkspacesQuery();

  useEffect(() => {
    if (data && data.length > 0) {
      setWorkspaces(data);
    } else if (data && data.length === 0) {
      setWorkspaces([]);
    }
  }, [data, setWorkspaces, workspaces.length]);

  return {
    data,
    isLoading,
    isPending,
    isError,
  };
};
