import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common';
import { NotificationType } from '@app/common/types/notification';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async createNotification(
    userId: string,
    title: string,
    content: string,
    type: NotificationType,
  ) {
    return this.prisma.notification.create({
      data: {
        userId,
        title,
        content,
        type,
      },
    });
  }

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markNotificationAsRead(notificationId: number) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date() },
    });
  }

  async deleteNotification(notificationId: number) {
    return this.prisma.notification.delete({
      where: { id: notificationId },
    });
  }
}
