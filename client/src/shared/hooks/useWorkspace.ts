import { useGetWorkspaceByIdQuery } from "@/features/workspace/api/queries";
import { useWorkspaceStore } from "@/features/workspace/store";
import { useEffect } from "react";

export const useWorkspace = (id: string) => {
  const { currentWorkspace, setCurrentWorkspace } = useWorkspaceStore();
  const { data, isPending, isError, isLoading } = useGetWorkspaceByIdQuery(id, {
    enabled: !!id && !currentWorkspace,
  });

  useEffect(() => {
    if (data) {
      setCurrentWorkspace(data);
    }
  }, [currentWorkspace, data, setCurrentWorkspace]);

  return {
    data,
    isPending,
    isLoading,
    isError,
  };
};
