import React, { Activity } from "react";
import { Logo } from "@/shared/icons";

const AuthLayout = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center px-4">
      <Logo className="mb-4 h-12 w-12" />
      <Activity mode={title ? "visible" : "hidden"}>
        <h1 className="mb-8 text-center text-lg font-medium">{title}</h1>
      </Activity>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
};

export default AuthLayout;
