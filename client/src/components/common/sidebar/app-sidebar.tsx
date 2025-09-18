"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Box,
  Check,
  ChevronDown,
  Command,
  Ellipsis,
  Frame,
  Inbox,
  Laptop2,
  LaptopMinimalCheck,
  Layers2,
  LifeBuoy,
  Map,
  Maximize,
  PieChart,
  Search,
  Send,
  Settings2,
  SquarePen,
  SquareTerminal,
  ThumbsUp,
  Zap,
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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

  const generalSidebarItems: SidebarItem[] = [
    {
      icon: Zap,
      iconProps: {
        fill: "currentColor",
      },
      name: "Pulse",
      url: "#",
    },
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

  const teamsSidebarItems: SidebarItem[] = [
    {
      icon: Laptop2,
      name: "Development Team",
      url: "#",
    },
    {
      icon: ThumbsUp,
      name: "Customer Success",
      url: "#",
    },
    {
      icon: LaptopMinimalCheck,
      name: "Marketing Team",
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
              <DropdownMenuItem>Settings</DropdownMenuItem>
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
                        >
                          {workspace.name}
                          <Check className="size-4" />
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Account</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          navigate("/workspace/create");
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
        <NavTeams teams={teamsSidebarItems} />
      </SidebarContent>
    </Sidebar>
  );
}
