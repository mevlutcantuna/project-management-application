import * as React from "react";
import { ChevronRight, Ellipsis, Plus, Settings } from "lucide-react";

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

interface NavTeamSidebarItem extends Team {
  url: string;
}

interface NavTeamSidebarProps
  extends React.ComponentPropsWithoutRef<typeof SidebarGroup> {
  teams: NavTeamSidebarItem[];
  enableAddTeam?: boolean;
  disableSettings?: boolean;
}

export function NavTeams({
  teams,
  enableAddTeam = false,
  disableSettings = false,
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
              {teams.map((item, index) => {
                const Icon = ICONS[item.iconName as keyof typeof ICONS];
                return (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url} className="group/item relative">
                        <div
                          style={{
                            backgroundColor: `color-mix(in srgb, ${item.color} 20%, transparent)`,
                          }}
                          className="flex h-4.5 w-4.5 items-center justify-center rounded-sm"
                        >
                          <Icon
                            color={item.color}
                            className="text-icon-color group-hover/item:text-icon-color-hover size-3.5 transition-colors duration-200"
                          />
                        </div>

                        <span className="text-sidebar-item-color">
                          {item.name}
                        </span>

                        {!disableSettings && (
                          <DropdownMenu>
                            <DropdownMenuTrigger className="text-icon-color/50 data-[state=open]:text-icon-color-hover invisible ml-auto transition-colors duration-200 group-hover/item:visible data-[state=open]:visible">
                              <Ellipsis className="size-3" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuItem>
                                <Settings />
                                Team Settings
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {enableAddTeam && (
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
                      <Plus className="text-icon-color group-hover/item:text-icon-color-hover size-3.5 transition-colors duration-200" />
                    </div>
                    <span className="text-sidebar-item-color">
                      Create a team
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </CollapsibleContent>
        </Collapsible>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
