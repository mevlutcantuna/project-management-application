"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { SidebarItem } from "./app-sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";

export function NavWorkspace({ workspaces }: { workspaces: SidebarItem[] }) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="w-full data-[state=open]:[&_svg]:rotate-90">
          <SidebarGroupLabel className="hover:bg-sidebar-link-hover flex h-6 w-full items-center gap-1">
            Workspaces{" "}
            <ChevronRight className="size-2 transition-transform duration-200" />
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenu className="pt-0">
            {workspaces.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
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
    </SidebarGroup>
  );
}
