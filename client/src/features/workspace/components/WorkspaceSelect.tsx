import { useEffect } from "react";
import { useGetMyWorkspacesQuery } from "../api/queries";
import { useWorkspaceStore } from "../store";
import { Combobox } from "@/components/combobox";
import { cn } from "@/shared/lib/utils";
import type { Workspace } from "@/shared/types/workspace";

interface WorkspaceSelectProps {
  className?: string;
  onChange: (workspace: Workspace | null) => void;
  value: Workspace["id"];
}

const WorkspaceSelect = ({
  className,
  onChange,
  value,
}: WorkspaceSelectProps) => {
  const { workspaces, setWorkspaces } = useWorkspaceStore();
  const { data: allWorkspaces = [] } = useGetMyWorkspacesQuery();

  useEffect(() => {
    if (allWorkspaces && allWorkspaces.length > 0) {
      setWorkspaces(allWorkspaces);
    }
  }, [allWorkspaces, setWorkspaces]);

  const handleChange = (value: Workspace["id"]) => {
    const workspace = workspaces.find((workspace) => workspace.id === value);
    if (workspace) {
      onChange(workspace);
    } else {
      onChange(null);
    }
  };

  console.log({ value });

  return (
    <Combobox
      options={workspaces.map((workspace) => ({
        value: workspace.id,
        label: workspace.name,
      }))}
      value={value}
      onChange={handleChange}
      placeholder="Select a workspace"
      noOptionsMessage="No workspaces found"
      className={cn("w-full", className)}
    />
  );
};

export default WorkspaceSelect;
