import { api } from "@/shared/lib/api";
import type { User } from "@/shared/types/user";
import { useQuery } from "@tanstack/react-query";

export const useGetMeQuery = () => {
  return useQuery<User>({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await api.get("/auth/me");
      return response.data;
    },
  });
};
