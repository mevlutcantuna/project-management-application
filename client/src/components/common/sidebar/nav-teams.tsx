import * as React from "react";
import { ChevronRight, LaptopMinimalCheck, Plus } from "lucide-react";

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
import { Link } from "react-router-dom";

interface NavTeamSidebarItem extends Team {
  url: string;
}

export function NavTeams({
  teams,
  ...props
}: {
  teams: NavTeamSidebarItem[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
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

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("add team");
                }}
                className="hover:text-sidebar-accent-foreground text-muted-foreground hidden group-hover/label:block"
              >
                <Plus className="size-4" />
              </button>
            </SidebarGroupLabel>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenu className="pt-0">
              {teams.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="group/item">
                      <LaptopMinimalCheck className="text-icon-color group-hover/item:text-icon-color-hover transition-colors duration-200" />
                      <span className="text-icon-color">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </CollapsibleContent>
        </Collapsible>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
