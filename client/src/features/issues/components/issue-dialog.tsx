import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import IssueForm from "./issue-form";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronRight, Maximize2, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import TeamIcon from "@/components/common/team-icon";
import { useParams } from "react-router-dom";
import { useTeamStore } from "@/features/teams/store";
import type { ICONS } from "@/components/common/icon-picker/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

const IssueDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { teamId } = useParams();
  const { teams } = useTeamStore();
  const [isMaximized, setIsMaximized] = useState(false);

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const defaultTeam = teamId
    ? teams.find((team) => team.identifier === teamId)
    : (teams[0] ?? null);

  const [selectedTeamId, setSelectedTeamId] = useState(defaultTeam?.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "top-[15%] translate-y-[0%] items-start gap-1 p-0 sm:max-w-3xl",
          isMaximized && "h-[70%] sm:max-w-4xl"
        )}
        closeButtonClassName="hidden"
      >
        <div className="flex items-center justify-between px-3 pt-3 pb-1.5">
          <div className="flex items-center gap-1">
            <Select
              value={defaultTeam?.identifier}
              onValueChange={setSelectedTeamId}
            >
              <SelectTrigger
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "!h-6 w-fit py-0 !pr-2 !pl-1 shadow-none outline-none [&>svg]:hidden"
                )}
              >
                <TeamIcon
                  size="sm"
                  iconName={defaultTeam?.iconName as keyof typeof ICONS}
                  color={defaultTeam?.color}
                />
                <span className="text-sm uppercase">
                  {teams.find((team) => team.id === selectedTeamId)?.identifier}
                </span>
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem value={team.id} key={team.id}>
                    <TeamIcon
                      iconName={team.iconName as keyof typeof ICONS}
                      color={team.color}
                    />
                    <span className="text-sm">{team.name}</span>
                    <span className="text-muted-foreground mr-3 text-sm uppercase">
                      {team.identifier}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ChevronRight className="text-icon-color size-3.5" />

            <span className="text-primary text-sm">New Issue</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              className="h-6 w-6 p-0"
              variant="ghost"
              size="icon"
              onClick={handleMaximize}
            >
              <Maximize2 className="size-3" />
            </Button>
            <DialogClose asChild>
              <Button className="h-6 w-6 p-0" variant="ghost" size="icon">
                <X className="size-4" />
              </Button>
            </DialogClose>
          </div>
        </div>
        <IssueForm />
      </DialogContent>
    </Dialog>
  );
};

export default IssueDialog;
