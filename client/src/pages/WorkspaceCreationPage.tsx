import { useCreateWorkspaceMutation } from "@/features/workspace/api/mutations";
import Layout from "@/features/workspace/components/Layout";
import WorkspaceForm, {
  type WorkspaceFormSchema,
} from "@/features/workspace/components/WorkspaceForm";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const WorkspaceSelectionPage = () => {
  const navigate = useNavigate();
  const { mutate: createWorkspace } = useCreateWorkspaceMutation({
    onSuccess: (data) => {
      console.log(data);
      toast.success("Success", {
        description: "You have successfully created a workspace",
      });
      navigate(`/${data.url}`);
    },
  });

  const handleSubmit = (data: WorkspaceFormSchema) => {
    createWorkspace({
      name: data.name,
      description: data.description ?? "",
      url: data.url,
    });
  };

  return (
    <Layout
      title="Create a workspace"
      description="Create a new workspace to access your projects and collaborate with your team."
      navigationButton={{
        label: "Back to selection",
        icon: ChevronLeft,
        onClick: () => {
          navigate("/");
        },
      }}
    >
      <WorkspaceForm onSubmit={handleSubmit} />
    </Layout>
  );
};

export default WorkspaceSelectionPage;
