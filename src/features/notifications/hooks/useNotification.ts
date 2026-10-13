"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { COLLECTIONS } from "@/lib/constants/COLLECTIONS";
import notificationsService from "../services/notification.service";
import {
  Notification,
  CreateNotificationInput,
  UpdateNotificationInput,
} from "../types/notification.type";

export const useNotificationsQuery = () => {
  return useQuery({
    queryKey: [COLLECTIONS.NOTIFICATIONS],
    queryFn: () => notificationsService.fetchNotifications(),
  });
};

export const useNotificationQuery = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [COLLECTIONS.NOTIFICATIONS, id],
    queryFn: () => notificationsService.fetchNotificationById(id),
    enabled: Boolean(id),

    initialData: () => {
      const listQueries = queryClient.getQueriesData<Notification[]>({
        queryKey: [COLLECTIONS.NOTIFICATIONS],
      });

      return listQueries
        .flatMap(([, notifications]) => notifications ?? [])
        .find((notification) => notification.id === id);
    },
  });
};

export const useNotificationsByUserQuery = (userId: string) => {
  return useQuery({
    queryKey: [COLLECTIONS.NOTIFICATIONS, "user", userId],
    queryFn: () => notificationsService.fetchNotificationsByUserId(userId),
    enabled: Boolean(userId),
  });
};

export const useUnreadNotificationsQuery = (userId: string) => {
  return useQuery({
    queryKey: [COLLECTIONS.NOTIFICATIONS, "user", userId, "unread"],
    queryFn: () => notificationsService.fetchUnreadNotifications(userId),
    enabled: Boolean(userId),
  });
};

export const useCreateNotificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNotificationInput) =>
      notificationsService.createNotification(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.NOTIFICATIONS],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard", "stats"],
      });

      toast.success("Notification created successfully");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to create notification");
    },
  });
};

export const useUpdateNotificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNotificationInput }) =>
      notificationsService.updateNotification(id, data),

    onSuccess: (updated) => {
      queryClient.setQueryData(
        [COLLECTIONS.NOTIFICATIONS, updated.id],
        updated,
      );

      queryClient.setQueriesData<Notification[]>(
        { queryKey: [COLLECTIONS.NOTIFICATIONS] },
        (old) =>
          old?.map((notification) =>
            notification.id === updated.id ? updated : notification,
          ),
      );

      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.NOTIFICATIONS],
      });

      toast.success("Notification updated successfully");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to update notification");
    },
  });
};

export const useMarkNotificationAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsService.markNotificationAsRead(id),

    onSuccess: (updated) => {
      queryClient.setQueryData(
        [COLLECTIONS.NOTIFICATIONS, updated.id],
        updated,
      );

      queryClient.setQueriesData<Notification[]>(
        { queryKey: [COLLECTIONS.NOTIFICATIONS] },
        (old) =>
          old?.map((notification) =>
            notification.id === updated.id ? updated : notification,
          ),
      );

      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.NOTIFICATIONS],
      });

      toast.success("Notification marked as read");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to mark notification as read");
    },
  });
};

export const useDeleteNotificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsService.deleteNotification(id),

    onSuccess: (_, id) => {
      queryClient.removeQueries({
        queryKey: [COLLECTIONS.NOTIFICATIONS, id],
      });

      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.NOTIFICATIONS],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard", "stats"],
      });

      toast.success("Notification deleted successfully");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete notification");
    },
  });
};
