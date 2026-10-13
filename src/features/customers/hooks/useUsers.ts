"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import usersService from "../services/usersService";

import { toast } from "sonner";
import { CreateUserFormValues, EditUserFormValues } from "../schemas";
import { UserType, UserFilters } from "../types";
import { COLLECTIONS } from "@/lib/constants/COLLECTIONS";

export const useUsersQuery = (filters: UserFilters) => {
  return useQuery({
    queryKey: [COLLECTIONS.USERS, filters],

    queryFn: () => {
      const result = usersService.fetchUsers(filters);
      console.log(
        `Fetching users with filters: ${result} and filters:`,
        filters,
      );
      return result;
    },
  });
};

export const useUserQuery = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [COLLECTIONS.USERS, id],
    queryFn: () => usersService.fetchUserById(id),

    initialData: () => {
      const listQueries = queryClient.getQueriesData<UserType[]>({
        queryKey: [COLLECTIONS.USERS],
      });

      return listQueries
        .flatMap(([, users]) => users ?? [])
        .find((user) => user.id === id);
    },
  });
};

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserFormValues) => usersService.createUser(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.USERS] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });

      toast.success("User account created successfully");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to create user account");
    },
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditUserFormValues }) =>
      usersService.updateUser(id, data),

    onSuccess: (updated) => {
      // Update detail cache
      queryClient.setQueryData([COLLECTIONS.USERS, updated.id], updated);

      // Update list cache
      queryClient.setQueriesData<UserType[]>(
        { queryKey: [COLLECTIONS.USERS] },
        (old) =>
          old?.map((user) => (user.id === updated.id ? updated : user)) ?? [],
      );

      toast.success(`Updated details for ${updated.fullName}`);
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to update user details");
    },
  });
};

export const useRestoreUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.restoreUser(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.USERS] });
      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.USERS, updated.id],
      });
      toast.success("User account restored");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to restore user account");
    },
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.deleteUser(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.USERS] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
      toast.success("User account deleted");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete user account");
    },
  });
};
