import { useEffect } from "react";
import { useGetMyWorkspacesQuery } from "../api/queries";
import { useWorkspaceStore } from "../store";
import { Combobox } from "@/components/Combobox";
import { cn } from "@/shared/lib/utils";

interface WorkspaceSelectProps {
  className?: string;
  onChange: (value: string) => void;
  value: string;
}

const WorkspaceSelect = ({
  className,
  onChange,
  value,
}: WorkspaceSelectProps) => {
  const selectedWorkspaceFromLocalStorage =
    localStorage.getItem("currentWorkspace");
  const { workspaces, setWorkspaces, setCurrentWorkspace } =
    useWorkspaceStore();
  const { data: allWorkspaces = [] } = useGetMyWorkspacesQuery();

  useEffect(() => {
    if (allWorkspaces && allWorkspaces.length > 0) {
      setWorkspaces(allWorkspaces);
    }
  }, [allWorkspaces, setWorkspaces]);

  useEffect(() => {
    const currentWorkspace = workspaces.find(
      (workspace) => workspace.id === selectedWorkspaceFromLocalStorage
    );

    if (currentWorkspace) {
      setCurrentWorkspace(currentWorkspace ?? null);
    } else {
      setCurrentWorkspace(null);
      localStorage.removeItem("currentWorkspace");
    }
  }, [selectedWorkspaceFromLocalStorage, setCurrentWorkspace, workspaces]);

  const handleChange = (value: string) => {
    localStorage.setItem("currentWorkspace", value);
    setCurrentWorkspace(
      workspaces.find((workspace) => workspace.id === value) ?? null
    );
    onChange(value);
  };

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
