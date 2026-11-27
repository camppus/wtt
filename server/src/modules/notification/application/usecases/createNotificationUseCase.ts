import { Inject, Injectable } from '@nestjs/common';
import Notification from '../../domain/entities/Notification';
import type NotificationRepository from '../../domain/repositories/NotificationRepository';
import { NotificationPayload } from '../dto/NotificationPayload';

@Injectable()
export default class CreateNotification {
  constructor(
    @Inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(input: NotificationPayload): Promise<void> {
    const notification = Notification.create({
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
    });
    await this.notificationRepository.save(notification);
  }
}
