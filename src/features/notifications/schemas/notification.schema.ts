import { z } from 'zod';

export const notificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string().min(1),
  message: z.string().min(1),
  type: z.enum(['info', 'warning', 'error', 'success']),
  isRead: z.boolean().default(false),
  createdAt: z.date(),
});

export const createNotificationSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(1),
  message: z.string().min(1),
  type: z.enum(['info', 'warning', 'error', 'success']),
});

export const updateNotificationSchema = z.object({
  title: z.string().min(1).optional(),
  message: z.string().min(1).optional(),
  isRead: z.boolean().optional(),
});
