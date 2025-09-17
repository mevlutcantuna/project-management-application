import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { SidebarItem } from "./app-sidebar";

export function NavGeneral({ items }: { items: SidebarItem[] }) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem>
            <SidebarMenuButton size="sm" asChild tooltip={item.name}>
              <a href={item.url} className="group/item">
                <item.icon
                  {...item.iconProps}
                  className="text-icon-color group-hover/item:text-icon-color-hover transition-colors duration-200"
                />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
