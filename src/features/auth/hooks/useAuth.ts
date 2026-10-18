import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { useAuthStore } from "@/lib/store/authStore";

export const AUTH_QUERY_KEY = ["auth", "me"] as const;

export function useCurrentUser() {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: authService.getCurrentUser,
    retry: false,
  });
}

export function useAdminLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: AUTH_QUERY_KEY,
      });
    },
  });
}

export function useGoogleLogin() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: authService.loginWithGoogle,
    onSuccess: async () => {
      const user = await authService.getCurrentUser();
      setUser(user);
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
      await queryClient.invalidateQueries({
        queryKey: AUTH_QUERY_KEY,
      });
    },
  });
}

export function usePhoneLogin() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: authService.loginWithPhoneNumber,
    onSuccess: async () => {
      const user = await authService.getCurrentUser();
      setUser(user);
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
      await queryClient.invalidateQueries({
        queryKey: AUTH_QUERY_KEY,
      });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: async () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);

      await queryClient.invalidateQueries({
        queryKey: AUTH_QUERY_KEY,
      });
    },
  });
}
