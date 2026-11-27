import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type NotificationRepository from '../../domain/repositories/NotificationRepository';

@Injectable()
export default class ReadNotification {
  constructor(
    @Inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(userId: string, notificationId: string): Promise<void> {
    const notification =
      await this.notificationRepository.findById(notificationId);

    if (!notification || notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }
    if (notification.isRead) {
      return;
    }
    notification.markAsRead();
    await this.notificationRepository.save(notification);
  }
}
