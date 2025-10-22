import { useGetWorkspaceTeamsQuery } from "@/features/teams/api/queries";
import { useTeamStore } from "@/features/teams/store";
import { useWorkspaceStore } from "@/features/workspace/store";
import { useEffect } from "react";

export const useTeams = () => {
  const { currentWorkspace } = useWorkspaceStore();
  const { setTeams } = useTeamStore();
  const { data, isPending, isLoading, isError } = useGetWorkspaceTeamsQuery(
    currentWorkspace?.id || "",
    {
      enabled: !!currentWorkspace?.id,
    }
  );

  useEffect(() => {
    if (data && data.length > 0) {
      setTeams(data);
    } else if (data && data.length === 0) {
      setTeams([]);
    }
  }, [data, setTeams]);

  return {
    data,
    isLoading,
    isPending,
    isError,
  };
};
