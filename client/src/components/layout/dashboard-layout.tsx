import { AppSidebar } from "@/components/common/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useGetWorkspaceByUrlQuery } from "@/features/workspace/api/queries";
import { Outlet, useParams } from "react-router-dom";

const Dashboard = () => {
  const { workspaceUrl } = useParams();
  const { data: workspace } = useGetWorkspaceByUrlQuery(workspaceUrl ?? "");

  console.log(workspace);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Dashboard;
