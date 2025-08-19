import React from "react";
import { Logo } from "@/shared/icons";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center px-4">
      <Logo className="mb-4 h-12 w-12" />
      <h1 className="mb-8 text-center text-lg font-medium">
        Log in to your account
      </h1>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
};

export default AuthLayout;
