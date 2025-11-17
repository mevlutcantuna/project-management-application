import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import IssueForm from "./issue-form";
import { Button } from "@/components/ui/button";
import { Maximize2, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";

const IssueDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [isMaximized, setIsMaximized] = useState(false);

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "top-[15%] translate-y-[0%] items-start p-0 sm:max-w-3xl",
          isMaximized && "h-[70%] sm:max-w-4xl"
        )}
        closeButtonClassName="hidden"
      >
        <div className="flex items-center justify-between px-3 pt-3 pb-1.5">
          <div></div>
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
