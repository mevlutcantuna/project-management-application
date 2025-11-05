"use client";

import * as React from "react";
import {
  CircleUserRound,
  SlidersHorizontal,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import { NavTeams } from "@/components/common/sidebar/nav-teams";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useTeamStore } from "@/features/teams/store";
import { NavGeneral } from "./nav-general";
import { useWorkspaceStore } from "@/features/workspace/store";
import BackButton from "../back-button";

export interface SidebarItem {
  icon: LucideIcon;
  iconProps?: LucideProps;
  name: string;
  url: string;
}

export function SettingsSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspaceStore();
  const { teams } = useTeamStore();

  const generalSettingsItems: SidebarItem[] = [
    {
      icon: SlidersHorizontal,
      name: "Prefenrences",
      url: "#",
    },
    {
      icon: CircleUserRound,
      name: "Profile",
      url: "#",
    },
  ];

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="pt-1.5">
        <BackButton onClick={() => navigate("/")}>Back to app</BackButton>
      </SidebarHeader>
      <SidebarContent>
        <NavGeneral items={generalSettingsItems} />
        <NavTeams
          disableSettings={true}
          enableAddTeam={true}
          teams={teams.map((team) => ({
            ...team,
            url: `/${currentWorkspace?.url}/settings/team/${team.identifier}`,
          }))}
        />
      </SidebarContent>
    </Sidebar>
  );
}
