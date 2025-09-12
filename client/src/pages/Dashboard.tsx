import { useGetWorkspaceByUrlQuery } from "@/features/workspace/api/queries";
import { useParams } from "react-router-dom";

const Dashboard = () => {
  const { workspaceUrl } = useParams();
  const { data: workspace } = useGetWorkspaceByUrlQuery(workspaceUrl ?? "");

  return <div> {JSON.stringify(workspace)}</div>;
};

export default Dashboard;
