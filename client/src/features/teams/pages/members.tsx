import TeamIcon from "@/components/common/team-icon";
import { useWorkspaceStore } from "@/features/workspace/store";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useGetTeamByIdentifierQuery } from "../api/queries";
import { COLORS, ICONS } from "@/components/common/icon-picker/constants";
import BackButton from "@/components/common/back-button";
import { Ellipsis, SearchIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/features/auth/store";
import { Activity, useState } from "react";
import type { Team } from "@/shared/types/team";
import {
  useLeaveTeamMutation,
  useRemoveUserFromTeamMutation,
} from "../api/mutations";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import MemberForm from "../components/member-form";

export const TeamMembersPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspaceStore();
  const { identifier } = useParams();
  const { data: team, isLoading } = useGetTeamByIdentifierQuery(
    identifier as string,
    currentWorkspace?.id as string
  );
  const { user: currentUser } = useAuthStore();

  const { mutate: removeUserFromTeam } = useRemoveUserFromTeamMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["team-by-identifier", identifier as string],
      });
    },
  });
  const { mutate: leaveTeam } = useLeaveTeamMutation({
    onSuccess: () => {
      toast.success("You have left the team successfully");
      queryClient.invalidateQueries({ queryKey: ["workspace-teams"] });
      navigate(`/${currentWorkspace?.url}/settings/team/create`);
    },
  });
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const users =
    team?.users.filter(
      (user) =>
        (user.firstName + " " + user.lastName)
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

  const isCurrentUserTeamAdminOrManager = team?.users.some(
    (user) =>
      user.id === currentUser?.id &&
      (user.role === "Admin" || user.role === "Manager")
  );

  const actions = [
    {
      hidden: (user: Team["users"][number]) =>
        !isCurrentUserTeamAdminOrManager || user.id === currentUser?.id,
      label: "Remove",
      onClick: (user: Team["users"][number]) => {
        removeUserFromTeam({
          workspaceId: currentWorkspace?.id as string,
          teamId: team?.id as string,
          userId: user.id,
        });
      },
    },
    {
      hidden: (user: Team["users"][number]) => user.id !== currentUser?.id,
      label: "Leave Team",
      onClick: () => {
        leaveTeam({
          workspaceId: currentWorkspace?.id as string,
          teamId: team?.id as string,
        });
      },
    },
  ];

  if (isLoading) {
    return null;
  }

  if (!team) {
    return <Navigate to={`/${currentWorkspace?.url}/settings/team/create`} />;
  }

  return (
    <div className="relative py-16">
      <BackButton
        className="absolute top-3 left-4"
        onClick={() =>
          navigate(`/${currentWorkspace?.url}/settings/team/${identifier}`)
        }
      >
        <TeamIcon
          iconName={team.iconName as keyof typeof ICONS}
          color={team.color ?? COLORS.gray}
        />
        <span>{team.name}</span>
      </BackButton>
      <div className="w-full px-10">
        <div className="flex items-end justify-between px-4">
          <div className="w-full space-y-3">
            <h1 className="text-primary text-2xl leading-8">Team members</h1>
            <InputGroup size="sm" className="max-w-3xs">
              <InputGroupInput
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
            </InputGroup>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="primary" size="sm">
                Add a member
              </Button>
            </DialogTrigger>
            <DialogContent
              className="gap-0 p-0"
              closeButtonClassName="top-[22px] right-6"
            >
              <div className="flex items-center gap-2 border-b-[0.1px] px-6 py-4">
                <TeamIcon
                  className="size-6"
                  iconName={team.iconName as keyof typeof ICONS}
                  color={team.color ?? COLORS.gray}
                />
                <span className="text-primary text-base">
                  Add to your workspace
                </span>
              </div>
              <div className="px-6 py-8">
                <MemberForm
                  team={team}
                  onSuccess={() => {
                    queryClient.invalidateQueries({
                      queryKey: ["team-by-identifier", team.identifier],
                    });
                    setOpen(false);
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mt-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-14">Name</TableHead>
              <TableHead className="w-40">Email</TableHead>
              <TableHead className="w-20">Role</TableHead>
              <TableHead className="w-32 pr-14"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length ? (
              users.map((user) => (
                <TableRow key={user.id} className="group">
                  <TableCell className="pl-14 font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-6">
                        <AvatarImage src={user.profilePicture ?? undefined} />
                        <AvatarFallback>
                          {user.firstName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="pr-6 text-right">
                    {actions.filter((action) => !action.hidden(user)).length >
                      0 && (
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className="invisible group-hover:visible data-[state=open]:visible"
                          asChild
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                          >
                            <Ellipsis />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {actions.map((action) => (
                            <Activity
                              key={action.label}
                              mode={action.hidden(user) ? "hidden" : "visible"}
                            >
                              <DropdownMenuItem
                                key={action.label}
                                onClick={() => action.onClick(user)}
                              >
                                {action.label}
                              </DropdownMenuItem>
                            </Activity>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
