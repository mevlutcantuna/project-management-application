import { useGetWorkspaceByUrlQuery } from "@/features/workspace/api/queries";
import { useWorkspaceStore } from "@/features/workspace/store";
import { useEffect } from "react";

export const useWorkspace = (url: string) => {
  const { currentWorkspace, setCurrentWorkspace } = useWorkspaceStore();
  const { data, isPending, isError, isLoading } = useGetWorkspaceByUrlQuery(
    url,
    {
      enabled: !!url && !currentWorkspace,
    }
  );

  useEffect(() => {
    if (data) {
      setCurrentWorkspace(data);
    }
  }, [currentWorkspace, data, setCurrentWorkspace]);

  useEffect(() => {
    if (!url) {
      setCurrentWorkspace(null, false);
    }
  }, [url, setCurrentWorkspace]);

  return {
    data,
    isPending,
    isLoading,
    isError,
  };
};
