import { api } from "@/shared/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useGetMeQuery = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/auth/me"),
  });
};
