import { toast } from "sonner";
import { getErrorMessage } from "@/shared/lib/utils";
import { AxiosError } from "axios";

import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
