import * as React from "react";
import { ChevronRight } from "lucide-react";

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
import type { SidebarItem } from "./app-sidebar";

export function NavTeams({
  teams,
  ...props
}: {
  teams: SidebarItem[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="w-full data-[state=open]:[&_svg]:rotate-90">
            <SidebarGroupLabel className="hover:bg-sidebar-link-hover flex h-6 w-full items-center gap-1">
              Your Teams
              <ChevronRight className="size-2 transition-transform duration-200" />
            </SidebarGroupLabel>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenu className="pt-0">
              {teams.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild size="sm">
                    <a href={item.url} className="group/item">
                      <item.icon className="text-icon-color group-hover/item:text-icon-color-hover transition-colors duration-200" />
                      <span className="text-icon-color">{item.name}</span>
                    </a>
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
