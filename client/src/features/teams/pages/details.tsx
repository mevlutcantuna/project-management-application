import { Card } from "@/components/ui/card";
import { useGetTeamByIdentifierQuery } from "@/features/teams/api/queries";
import TeamForm from "@/features/teams/components/team-form";
import { useWorkspaceStore } from "@/features/workspace/store";
import { ChevronRight, Users2 } from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useDeleteTeamMutation, useUpdateTeamMutation } from "../api/mutations";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTeamStore } from "../store";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

export const TeamDetailsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspaceStore();
  const { identifier } = useParams();
  const { teams } = useTeamStore();
  const { data: team, isLoading } = useGetTeamByIdentifierQuery(
    identifier as string,
    currentWorkspace?.id as string
  );
  const { mutate: updateTeam, isPending: isUpdating } = useUpdateTeamMutation({
    onSuccess: (data) => {
      toast.success("Team updated successfully");
      navigate(`/${currentWorkspace?.url}/settings/team/${data.identifier}`);
      queryClient.invalidateQueries({ queryKey: ["workspace-teams"] });
      queryClient.invalidateQueries({
        queryKey: ["team-by-identifier", identifier as string],
      });
    },
  });
  const { mutate: deleteTeam, isPending: isDeleting } = useDeleteTeamMutation({
    onSuccess: () => {
      toast.success("Team deleted successfully");
      navigate(`/${currentWorkspace?.url}/settings/team/create`);
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

        <div className="mt-10">
          <h3 className="text-lg font-medium">Danger Zone</h3>
          <Card className="mt-3 p-0 [&>a:first-child]:rounded-t-sm [&>a:last-child]:rounded-b-sm">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm">Delete Team</span>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <span className="inline-block">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          disabled={teams.length <= 1}
                          variant="ghost"
                          className="text-destructive hover:text-destructive/80 h-6 px-2 text-sm"
                        >
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        className="gap-0"
                        closeButtonClassName="top-[22px] right-6"
                      >
                        <h4 className="text-lg font-medium">Delete Team</h4>
                        <p className="text-muted-foreground mt-2 text-sm">
                          Are you sure you want to delete this team? This action
                          cannot be undone.
                        </p>
                        <div className="mt-4 flex items-center justify-end gap-2">
                          <DialogClose asChild>
                            <Button size="sm" variant="outline">
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              deleteTeam({
                                workspaceId: currentWorkspace?.id as string,
                                teamId: team.id,
                              })
                            }
                            disabled={isDeleting}
                          >
                            Delete
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" hidden={teams.length > 1}>
                  <p>You cannot delete the last team in the workspace.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
