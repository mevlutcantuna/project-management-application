import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "@/shared/routes/route";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { getErrorMessage } from "./shared/lib/utils";
import { AxiosError } from "axios";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
  mutationCache: new MutationCache({
    onError: (error: unknown) => {
      // Skip error toast for auth endpoints (login/signup)
      if (
        error instanceof AxiosError &&
        !error?.request?.responseURL.includes("/login") &&
        !error?.request?.responseURL.includes("/signup")
      ) {
        toast.error("Error", {
          description: getErrorMessage(error),
        });
      }
    },
  }),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
