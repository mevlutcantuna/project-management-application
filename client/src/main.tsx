import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "@/shared/routing/route";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/shared/providers/theme-provider";
import { QueryProvider } from "@/shared/providers/query-provider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <QueryProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </QueryProvider>
    </ThemeProvider>
  </StrictMode>
);
