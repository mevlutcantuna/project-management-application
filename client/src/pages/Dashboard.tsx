import { useGetWorkspaceByIdQuery } from "@/features/workspace/api/queries";
import { useParams } from "react-router-dom";

const Dashboard = () => {
  const { workspaceId } = useParams();
  const { data: workspace } = useGetWorkspaceByIdQuery(workspaceId ?? "");

  return <div> {JSON.stringify(workspace)}</div>;
};

export default Dashboard;
