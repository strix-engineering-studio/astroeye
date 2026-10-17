import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminAuthService } from "../services/adminAuthService";
import type { IAdminUser } from "@/features/admins";

export const ADMIN_AUTH_QUERY_KEY = ["admin-auth", "me"] as const;

export function useCurrentAdmin() {
  return useQuery({
    queryKey: ADMIN_AUTH_QUERY_KEY,
    queryFn: adminAuthService.getCurrentUser,
    retry: false,
  });
}

export function useAdminLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminAuthService.login,
    onSuccess: async (data: IAdminUser) => {
      queryClient.setQueryData(ADMIN_AUTH_QUERY_KEY, data);
      await queryClient.invalidateQueries({
        queryKey: ADMIN_AUTH_QUERY_KEY,
      });
    },
  });
}

export function useAdminLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminAuthService.logout,
    onSuccess: async () => {
      queryClient.setQueryData(ADMIN_AUTH_QUERY_KEY, null);
      await queryClient.invalidateQueries({
        queryKey: ADMIN_AUTH_QUERY_KEY,
      });
    },
  });
}
