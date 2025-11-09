import { Card } from "@/components/ui/card";
import { useGetTeamByIdentifierQuery } from "@/features/teams/api/queries";
import TeamForm from "@/features/teams/components/team-form";
import { useWorkspaceStore } from "@/features/workspace/store";
import { ChevronRight, Users2 } from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useUpdateTeamMutation } from "../api/mutations";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const TeamDetailsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspaceStore();
  const { identifier } = useParams();
  const { data: team, isLoading } = useGetTeamByIdentifierQuery(
    identifier as string,
    currentWorkspace?.id as string
  );
  const { mutate: updateTeam, isPending: isUpdating } = useUpdateTeamMutation({
    onSuccess: (data) => {
      toast.success("Team updated successfully");
      navigate(`/${currentWorkspace?.url}/settings/team/${data.identifier}`);
      queryClient.invalidateQueries({ queryKey: ["workspace-teams"] });
    },
  });

  const settingsItems = [
    {
      icon: Users2,
      name: "Members",
      description: "Manage team members",
      url: `/${currentWorkspace?.url}/settings/team/${team?.identifier}/members`,
      rightText: `${team?.users.length} members`,
    },
  ];

  if (isLoading) {
    return null;
  }

  if (!team) {
    return <Navigate to={`/${currentWorkspace?.url}/settings/team/create`} />;
  }

  return (
    <div className="mx-10 my-16 flex items-start justify-center">
      <div className="w-full max-w-[40rem]">
        <div className="mb-8 space-y-1">
          <h1 className="text-primary text-2xl leading-8 font-medium">
            {team?.name ?? ""}
          </h1>
        </div>

        <TeamForm
          layoutType="horizontal"
          defaultValues={
            team
              ? {
                  name: team.name,
                  identifier: team.identifier,
                  icon: {
                    icon: team.iconName,
                    color: team.color,
                  },
                }
              : undefined
          }
          onSubmit={(data) => {
            if (!currentWorkspace?.id || !team?.id) return;

            updateTeam({
              name: data.name,
              identifier: data.identifier,
              iconName: data.icon.icon,
              color: data.icon.color,
              id: team.id,
              workspaceId: currentWorkspace.id,
            });
          }}
          submitButtonText="Save"
          isSubmitting={isUpdating}
        />

        <Card className="mt-3 p-0 [&>a:first-child]:rounded-t-sm [&>a:last-child]:rounded-b-sm">
          {settingsItems.map((item) => (
            <Link
              key={item.url}
              to={item.url}
              className="hover:bg-accent/20 flex items-center justify-between px-4 py-3 transition-colors duration-100"
            >
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground bg-secondary flex aspect-square h-8 w-8 items-center justify-center rounded-sm p-0 shadow-xs">
                  <item.icon width={16} height={16} />
                </span>
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {item.description}
                  </span>
                </div>
              </div>

              <div className="text-muted-foreground flex items-center gap-2">
                <span className="text-muted-foreground text-xs">
                  {item.rightText}
                </span>
                <ChevronRight width={18} height={18} />
              </div>
            </Link>
          ))}
        </Card>
      </div>
    </div>
  );
};
