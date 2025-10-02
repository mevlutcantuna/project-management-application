import { SettingsSidebar } from "@/components/common/sidebar/settings-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

const SettingsLayout = () => {
  return (
    <SidebarProvider>
      <SettingsSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SettingsLayout;
