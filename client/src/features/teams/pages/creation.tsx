import { useAuthStore } from "@/features/auth/store";
import { useCreateTeamMutation } from "@/features/teams/api/mutations";
import TeamForm, {
  type TeamFormSchema,
} from "@/features/teams/components/team-form";
import { useWorkspaceStore } from "@/features/workspace/store";
import { getErrorMessage } from "@/shared/lib/utils";
import type { ErrorResponse } from "@/shared/types/error";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const TeamCreationPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspaceStore();
  const { user: currentUser } = useAuthStore();
  const { mutate: createTeam, isPending } = useCreateTeamMutation({
    onSuccess: (data) => {
      toast.success("Team created successfully");
      navigate(`/${currentWorkspace?.url}/settings/team/${data.identifier}`);
      queryClient.invalidateQueries({ queryKey: ["workspace-teams"] });
    },
    onError: (error) => {
      toast.error("Failed to create team", {
        description: getErrorMessage(error as ErrorResponse),
      });
    },
  });

  const onSubmit = (data: TeamFormSchema) => {
    if (!currentWorkspace?.id || !currentUser?.id) return;

    createTeam({
      name: data.name,
      identifier: data.identifier,
      iconName: data.icon.icon,
      color: data.icon.color,
      workspaceId: currentWorkspace.id,
    });
  };

  return (
    <div className="mx-10 my-16 flex items-start justify-center">
      <div className="w-full max-w-[40rem]">
        <div className="mb-8 space-y-1">
          <h1 className="text-primary text-2xl leading-8 font-medium">
            Create a new team
          </h1>
          <p className="text-muted-foreground text-sm leading-[22px]">
            Create a new team to manage separate cycles, workflows and
            notifications
          </p>
        </div>

        <TeamForm
          onSubmit={onSubmit}
          submitButtonText="Create Team"
          isSubmitting={isPending}
        />
      </div>
    </div>
  );
};
