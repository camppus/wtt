import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { NotificationProps } from '../../domain/entities/Notification';
import type NotificationRepository from '../../domain/repositories/NotificationRepository';

@Injectable()
export default class GetNotification {
  constructor(
    @Inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(
    userId: string,
    notificationId: string,
  ): Promise<NotificationProps> {
    const notification =
      await this.notificationRepository.findById(notificationId);

    if (!notification || notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }

    return notification.toPrimitives();
  }
}
