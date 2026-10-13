import { apiClient } from "@/lib/api/client";
import {
  Notification,
  CreateNotificationInput,
  UpdateNotificationInput,
} from "../types/notification.type";

export const notificationsService = {
  async fetchNotifications() {
    return apiClient.get<Notification[]>("/notifications");
  },

  async fetchNotificationById(id: string) {
    return apiClient.get<Notification>(`/notifications/${id}`);
  },

  async fetchNotificationsByUserId(userId: string) {
    return apiClient.get<Notification[]>(
      `/notifications/user/${encodeURIComponent(userId)}`,
    );
  },

  async fetchUnreadNotifications(userId: string) {
    return apiClient.get<Notification[]>(
      `/notifications/user/${encodeURIComponent(userId)}/unread`,
    );
  },

  async createNotification(data: CreateNotificationInput) {
    return apiClient.post<Notification>("/notifications", data);
  },

  async updateNotification(id: string, data: UpdateNotificationInput) {
    return apiClient.patch<Notification>(`/notifications/${id}`, data);
  },

  async deleteNotification(id: string) {
    return apiClient.delete<void>(`/notifications/${id}`);
  },

  async markNotificationAsRead(id: string) {
    return apiClient.patch<Notification>(`/notifications/${id}/read`, {});
  },
};

export default notificationsService;