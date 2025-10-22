import * as React from "react";

import { cn } from "@/shared/lib/utils";

function Input({
  className,
  type,
  inputSize,
  ...props
}: React.ComponentProps<"input"> & { inputSize?: "sm" | "default" }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-indigo-400",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        inputSize === "sm"
          ? "h-8 text-sm"
          : inputSize === "default"
            ? "h-9"
            : "",
        className
      )}
      {...props}
    />
  );
}

export { Input };
