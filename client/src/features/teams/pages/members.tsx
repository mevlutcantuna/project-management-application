import TeamIcon from "@/components/common/team-icon";
import { useWorkspaceStore } from "@/features/workspace/store";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useGetTeamByIdentifierQuery } from "../api/queries";
import { COLORS, ICONS } from "@/components/common/icon-picker/constants";
import BackButton from "@/components/common/back-button";

export const TeamMembersPage = () => {
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspaceStore();
  const { identifier } = useParams();
  const { data: team, isLoading } = useGetTeamByIdentifierQuery(
    identifier as string,
    currentWorkspace?.id as string
  );

  if (isLoading) {
    return null;
  }

  if (!team) {
    return <Navigate to={`/${currentWorkspace?.url}/settings/team/create`} />;
  }

  return (
    <div className="relative flex items-start justify-center px-10 py-16">
      <BackButton
        className="absolute top-4 left-4"
        onClick={() =>
          navigate(`/${currentWorkspace?.url}/settings/team/${identifier}`)
        }
      >
        <TeamIcon
          iconName={team.iconName as keyof typeof ICONS}
          color={team.color ?? COLORS.gray}
        />
        <span>{team.name}</span>
      </BackButton>
      <div className="w-full max-w-[40rem]">
        <h1 className="text-primary text-2xl leading-8 font-medium">
          Team Members
        </h1>
      </div>
    </div>
  );
};
