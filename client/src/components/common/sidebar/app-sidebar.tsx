"use client";

import * as React from "react";
import {
  Box,
  Check,
  ChevronDown,
  Command,
  Ellipsis,
  Inbox,
  Layers2,
  Maximize,
  Moon,
  Search,
  SquarePen,
  Sun,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import { NavGeneral } from "@/components/common/sidebar/nav-general";
import { NavWorkspace } from "@/components/common/sidebar/nav-workspace";
import { NavTeams } from "@/components/common/sidebar/nav-teams";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/features/auth/store";
import { useWorkspaceStore } from "@/features/workspace/store";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTeamStore } from "@/features/teams/store";
import { useTheme } from "@/shared/hooks/use-theme";
export interface SidebarItem {
  icon: LucideIcon;
  iconProps?: LucideProps;
  name: string;
  url: string;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { workspaces, currentWorkspace } = useWorkspaceStore();
  const { teams } = useTeamStore();
  const { setTheme } = useTheme();

  const generalSidebarItems: SidebarItem[] = [
    {
      icon: Inbox,
      name: "Inbox",
      url: `${currentWorkspace?.url}/inbox`,
    },
    {
      icon: Maximize,
      name: "My Issues",
      url: `${currentWorkspace?.url}/my-issues`,
    },
  ];

  const workspaceSidebarItems: SidebarItem[] = [
    {
      icon: Box,
      name: "Projects",
      url: "#",
    },
    {
      icon: Layers2,
      name: "Views",
      url: "#",
    },
    {
      icon: Ellipsis,
      name: "More",
      url: "#",
    },
  ];

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="pt-1.5">
        <div className="flex justify-between gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="hover:bg-sidebar-link-hover aria-expanded:bg-sidebar-link-hover h-7 w-fit rounded-sm pr-1.5 pl-1 outline-none"
            >
              <div className="flex items-center gap-1.5">
                <div className="text-primary flex h-5 w-5 items-center justify-center rounded-lg bg-transparent">
                  <Command className="size-4" />
                </div>
                <span className="text-primary max-w-[100px] truncate text-sm font-semibold tracking-[-0.1px] whitespace-nowrap">
                  {currentWorkspace?.name || ""}
                </span>

                <ChevronDown className="size-3" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem
                onClick={() => navigate(`/${currentWorkspace?.url}/settings`)}
              >
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    Switch workspace
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                      {workspaces.map((workspace) => (
                        <DropdownMenuItem
                          className="flex items-center gap-2"
                          key={workspace.url}
                          onClick={() => {
                            if (workspace.id === currentWorkspace?.id) {
                              return;
                            }
                            navigate(`/${workspace.url}`);
                          }}
                        >
                          {workspace.name}
                          {workspace.id === currentWorkspace?.id && (
                            <Check className="size-4" />
                          )}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Account</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          navigate("/create");
                        }}
                      >
                        Create a workspace
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-7 w-7" variant="ghost" size="icon">
                  <Sun className="size-3.5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute size-3.5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button className="h-7 w-7" variant="ghost" size="icon">
              <Search className="size-3.5" />
            </Button>

            <Button className="h-7 w-7" variant="outline" size="icon">
              <SquarePen className="size-3.5" />
            </Button>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavGeneral items={generalSidebarItems} />
        <NavWorkspace workspaces={workspaceSidebarItems} />
        <NavTeams
          teams={teams.map((team) => ({
            ...team,
            url: `/${currentWorkspace?.url}/settings/team/${team.identifier}`,
          }))}
        />
      </SidebarContent>
    </Sidebar>
  );
}
