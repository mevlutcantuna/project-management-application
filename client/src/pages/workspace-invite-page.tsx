import { useWorkspaceStore } from "@/features/workspace/store";
import WorkspaceLayout from "@/features/workspace/components/layout";
import InvitationForm, {
  type InvitationFormSchema,
} from "@/features/workspace/components/invitation-form";
import { useSendWorkspaceInvitationMutation } from "@/features/workspace/api/mutations";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WorkspaceInvitePage = () => {
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspaceStore();
  const { mutate: sendInvitation } = useSendWorkspaceInvitationMutation({
    onSuccess: () => {
      toast.success("Success", {
        description: "You have successfully sent an invitation",
      });
    },
  });

  const handleSubmit = (data: InvitationFormSchema) => {
    sendInvitation({
      workspaceId: currentWorkspace?.id ?? "",
      email: data.email,
      role: data.role,
    });
  };

  return (
    <WorkspaceLayout
      title="Invite Team Members"
      description="Invite team members to collaborate in your workspace by sending them an email invitation"
      navigationButton={{
        label: "Back to workspace",
        icon: ChevronLeft,
        onClick: () => {
          navigate(`/${currentWorkspace?.url}`);
        },
      }}
    >
      <InvitationForm onSubmit={handleSubmit} />
    </WorkspaceLayout>
  );
};

export default WorkspaceInvitePage;
