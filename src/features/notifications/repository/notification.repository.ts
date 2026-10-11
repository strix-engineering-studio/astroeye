import { Prisma } from '@prisma/client';

export class NotificationRepository {
  private prisma: Prisma;

  constructor(prisma: Prisma) {
    this.prisma = prisma;
  }

  async createNotification(data: any): Promise<any> {
    return await this.prisma.notification.create({ data });
  }

  async findNotificationById(id: string): Promise<any | null> {
    return await this.prisma.notification.findUnique({ where: { id } });
  }

  async findAllNotifications(): Promise<any[]> {
    return await this.prisma.notification.findMany();
  }

  async updateNotification(id: string, data: any): Promise<boolean> {
    const result = await this.prisma.notification.update({
      where: { id },
      data,
    });
    return !!result;
  }

  async deleteNotification(id: string): Promise<boolean> {
    const result = await this.prisma.notification.delete({ where: { id } });
    return !!result;
  }

  async findNotificationsByUserId(userId: string): Promise<any[]> {
    return await this.prisma.notification.findMany({
      where: { userId },
    });
  }

  async findUnreadNotifications(userId: string): Promise<any[]> {
    return await this.prisma.notification.findMany({
      where: { userId, isRead: false },
    });
  }

  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    const result = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
    return !!result;
  }
}
