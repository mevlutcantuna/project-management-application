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
import { Activity } from "react";
import type { Team } from "@/shared/types/team";

export const TeamMembersPage = () => {
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspaceStore();
  const { identifier } = useParams();
  const { data: team, isLoading } = useGetTeamByIdentifierQuery(
    identifier as string,
    currentWorkspace?.id as string
  );
  const { user: currentUser } = useAuthStore();
  const users = team?.users ?? [];

  const isCurrentUserTeamAdminOrManager = users.some(
    (user) =>
      user.id === currentUser?.id &&
      (user.role === "Admin" || user.role === "Manager")
  );

  const actions = [
    {
      hidden: (user: Team["users"][number]) =>
        !isCurrentUserTeamAdminOrManager || user.id === currentUser?.id,
      label: "Remove",
      onClick: () => {
        console.log("remove");
      },
    },
    {
      hidden: (user: Team["users"][number]) => user.id !== currentUser?.id,
      label: "Leave Team",
      onClick: () => {
        console.log("leave team");
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
              <InputGroupInput placeholder="Search by name or email" />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
            </InputGroup>
          </div>
          <Button variant="primary" size="sm">
            Add a Member
          </Button>
        </div>
      </div>

      <div className="mt-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-14">Name</TableHead>
              <TableHead className="w-10">Email</TableHead>
              <TableHead className="w-10">Role</TableHead>
              <TableHead className="w-32 pr-14"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length ? (
              users.map((user) => (
                <TableRow key={user.id} className="group">
                  <TableCell className="pl-14">
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
                                onClick={action.onClick}
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
