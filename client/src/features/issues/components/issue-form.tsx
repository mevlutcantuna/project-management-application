import { useTeamStore } from "@/features/teams/store";
import React from "react";
import { useParams } from "react-router-dom";

const IssueForm = () => {
  const { teamId } = useParams();
  const { teams } = useTeamStore();

  const defaultTeam =
    teams.find((team) => team.identifier === teamId) ?? teams[0];

  return <div>IssueForm</div>;
};

export default IssueForm;
