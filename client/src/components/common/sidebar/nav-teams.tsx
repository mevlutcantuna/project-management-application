import * as React from "react";
import { Activity } from "react";
import {
  ChevronRight,
  Copy,
  Ellipsis,
  Play,
  Plus,
  Radius,
  Settings,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Team } from "@/shared/types/team";
import { Link, useNavigate } from "react-router-dom";
import { useWorkspaceStore } from "@/features/workspace/store";
import { ICONS } from "../icon-picker/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import TeamIcon from "../team-icon";

interface NavTeamSidebarItem extends Team {
  url?: string;
}

interface NavTeamSidebarProps
  extends React.ComponentPropsWithoutRef<typeof SidebarGroup> {
  teams: NavTeamSidebarItem[];
  enableAddTeam?: boolean;
  disableSettings?: boolean;
  enableSubMenu?: boolean;
}

export function NavTeams({
  teams,
  enableAddTeam = false,
  disableSettings = false,
  enableSubMenu = false,
  ...props
}: NavTeamSidebarProps) {
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspaceStore();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <Collapsible defaultOpen>
          <CollapsibleTrigger
            asChild
            className="w-full data-[state=open]:[&_svg]:rotate-90"
          >
            <SidebarGroupLabel className="hover:bg-sidebar-link-hover group/label flex h-6 w-full items-center justify-between gap-1">
              <div className="flex items-center gap-1">
                Your Teams
                <ChevronRight className="size-4 transition-transform duration-200" />
              </div>
            </SidebarGroupLabel>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenu className="pt-0">
              {teams.map((item) => {
                return (
                  <SidebarMenuItem key={item.identifier}>
                    <SidebarMenuButton
                      asChild={!!item.url}
                      className={cn("group/item h-auto py-1", {
                        "hover:bg-transparent active:bg-transparent":
                          enableSubMenu,
                      })}
                    >
                      {enableSubMenu ? (
                        <div>
                          <TeamItem team={item} />
                        </div>
                      ) : (
                        <Link to={item.url ?? "#"}>
                          <TeamItem team={item} />
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              <Activity mode={enableAddTeam ? "visible" : "hidden"}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(
                        `/${currentWorkspace?.url}/settings/team/create`
                      );
                    }}
                  >
                    <div className="flex h-4.5 w-4.5 items-center justify-center rounded-sm">
                      <Plus className="sub-menu-icon" />
                    </div>
                    <span className="text-sidebar-item-color">
                      Create a team
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Activity>
            </SidebarMenu>
          </CollapsibleContent>
        </Collapsible>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  function TeamItem({ team }: { team: NavTeamSidebarItem }) {
    const [open, setOpen] = React.useState(false);

    return (
      <Collapsible
        open={open}
        onOpenChange={(open) => setOpen(enableSubMenu && open)}
        className="w-full"
      >
        <CollapsibleTrigger
          asChild
          className="w-full data-[state=open]:[&_.arrow-icon]:rotate-90"
        >
          <div
            className={cn("relative flex h-5 w-full items-center gap-2", {
              "cursor-default": enableSubMenu,
            })}
          >
            <TeamIcon
              iconName={team.iconName as keyof typeof ICONS}
              color={team.color}
            />

            <span className="text-sidebar-item-color">{team.name}</span>

            <Activity mode={enableSubMenu ? "visible" : "hidden"}>
              <Play className="arrow-icon fill-sidebar-foreground text-sidebar-foreground size-1.5 transition-transform duration-200" />
            </Activity>

            <Activity mode={!disableSettings ? "visible" : "hidden"}>
              <DropdownMenu>
                <DropdownMenuTrigger className="text-icon-color/50 hover:text-icon-color-hover data-[state=open]:text-icon-color-hover invisible ml-auto transition-colors duration-200 group-hover/item:visible data-[state=open]:visible">
                  <Ellipsis className="size-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(
                        `/${currentWorkspace?.url}/settings/team/${team.identifier}`
                      );
                    }}
                  >
                    <Settings />
                    Team Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Activity>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenu className="p-0">
            <SidebarMenuItem className="group/menu-sub">
              <SidebarMenuButton className="pl-3">
                <div className="flex h-4.5 w-4.5 items-center justify-center rounded-sm">
                  <Radius className="sub-menu-icon" />
                </div>
                <span className="text-sidebar-item-color">Triage</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem className="group/menu-sub">
              <SidebarMenuButton className="pl-3">
                <div className="flex h-4.5 w-4.5 items-center justify-center rounded-sm">
                  <Copy className="sub-menu-icon" />
                </div>
                <span className="text-sidebar-item-color">Issues</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </CollapsibleContent>
      </Collapsible>
    );
  }
}
