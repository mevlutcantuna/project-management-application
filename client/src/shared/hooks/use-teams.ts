import { useGetWorkspaceTeamsQuery } from "@/features/teams/api/queries";
import { useTeamStore } from "@/features/teams/store";
import { useWorkspaceStore } from "@/features/workspace/store";
import { useEffect } from "react";

export const useTeams = () => {
  const { currentWorkspace } = useWorkspaceStore();
  const { teams, setTeams } = useTeamStore();
  const { data, isPending, isLoading, isError } = useGetWorkspaceTeamsQuery(
    currentWorkspace?.id || "",
    {
      enabled: !!currentWorkspace?.id && !teams.length,
    }
  );

  useEffect(() => {
    if (data && data.length > 0 && teams.length === 0) {
      setTeams(data);
    } else if (data && data.length === 0) {
      setTeams([]);
    }
  }, [data, setTeams, teams.length]);

  return {
    data,
    isLoading,
    isPending,
    isError,
  };
};
