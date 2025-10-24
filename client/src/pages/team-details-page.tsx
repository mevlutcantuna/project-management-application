import { useGetTeamByIdentifierQuery } from "@/features/teams/api/queries";
import { useWorkspaceStore } from "@/features/workspace/store";
import { useParams } from "react-router-dom";

const TeamDetailsPage = () => {
  const { identifier } = useParams();
  const { currentWorkspace } = useWorkspaceStore();
  const { data: team } = useGetTeamByIdentifierQuery(
    identifier || "",
    currentWorkspace?.id || "",
    {
      enabled: !!identifier && !!currentWorkspace?.id,
    }
  );

  return (
    <div className="mx-10 my-16 flex items-start justify-center">
      <div className="w-full max-w-[40rem]">
        <h2>{team?.name}</h2>
      </div>
    </div>
  );
};

export default TeamDetailsPage;
