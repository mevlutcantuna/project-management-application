import { useAuthStore } from "@/features/auth/store";
import Layout from "@/features/workspace/components/layout";
import WorkspaceSelectForm from "@/features/workspace/components/workspace-select-form";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const WorkspaceSelectionPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  return (
    <Layout
      title="Select a workspace"
      description="Choose from your available workspaces to access your projects and collaborate with your team."
      navigationButton={{
        label: "Log out",
        icon: LogOut,
        onClick: () => {
          logout();
          navigate("/login");
        },
      }}
    >
      <WorkspaceSelectForm />
    </Layout>
  );
};
