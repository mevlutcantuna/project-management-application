import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/features/auth/store";
import type { LucideProps } from "lucide-react";
import React, { Activity } from "react";

interface NavigationButton {
  label: string;
  onClick: () => void;
  icon?: React.ComponentType<LucideProps>;
}

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  navigationButton?: NavigationButton;
}

const Layout = ({
  children,
  title,
  description,
  navigationButton,
}: LayoutProps) => {
  const { user } = useAuthStore();
  const Icon = navigationButton?.icon;

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center px-4">
      <div className="absolute top-0 left-0 z-0 flex h-fit w-full items-center justify-between p-4">
        <span>
          <Activity mode={navigationButton ? "visible" : "hidden"}>
            <Button
              size="sm"
              variant="ghost"
              onClick={navigationButton?.onClick}
              className="text-muted-foreground flex h-7 cursor-pointer items-center gap-1 !px-2 text-xs"
            >
              <Activity mode={Icon ? "visible" : "hidden"}>
                {Icon && <Icon className="size-4" />}
              </Activity>
              {navigationButton?.label ?? "Back to Selection"}
            </Button>
          </Activity>
        </span>

        <div className="flex min-w-28 flex-col items-start gap-1 text-xs">
          <span className="text-muted-foreground">Logged in as</span>
          <span className="text-primary">
            {user?.firstName} {user?.lastName}
          </span>
        </div>
      </div>
      <Activity mode={title ? "visible" : "hidden"}>
        <h1 className="mb-4 text-center text-2xl font-normal">{title}</h1>
      </Activity>
      <Activity mode={description ? "visible" : "hidden"}>
        <p className="text-muted-foreground mb-8 max-w-md text-center text-[0.95rem]">
          {description}
        </p>
      </Activity>
      <Card className="flex w-full max-w-md flex-col items-center justify-center px-5">
        {children}
      </Card>
    </div>
  );
};

export default Layout;
