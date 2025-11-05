import { cn } from "@/shared/lib/utils";
import { ChevronLeft } from "lucide-react";
import React from "react";

const BackButton = ({
  children,
  className,
  ...props
}: React.ComponentProps<"button">) => {
  return (
    <button
      className={cn(
        "text-icon-color hover:bg-sidebar-link-hover hover:text-sidebar-accent-foreground flex h-7 w-fit cursor-pointer items-center gap-1.5 rounded-sm pr-2 pl-1.5 text-sm transition-all duration-100",
        className
      )}
      {...props}
    >
      <ChevronLeft className="size-3.5" />
      {children}
    </button>
  );
};

export default BackButton;
