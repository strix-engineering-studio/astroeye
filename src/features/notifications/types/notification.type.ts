export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  isRead: boolean;
  createdAt: Date;
}

export interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
}

export interface UpdateNotificationInput {
  title?: string;
  message?: string;
  isRead?: boolean;
}
