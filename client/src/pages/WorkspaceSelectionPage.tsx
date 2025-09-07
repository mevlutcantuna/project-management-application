import { useAuthStore } from "@/features/auth/store";
import Layout from "@/features/workspace/components/Layout";
import WorkspaceSelectForm from "@/features/workspace/components/WorkspaceSelectForm";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WorkspaceSelectionPage = () => {
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

export default WorkspaceSelectionPage;
