import { Inject, Injectable } from '@nestjs/common';
import Notification from '../../domain/entities/Notification';
import type NotificationRepository from '../../domain/repositories/NotificationRepository';

@Injectable()
export default class GetUnreadNotifications {
  constructor(
    @Inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(userId: string) {
    const result =
      await this.notificationRepository.countUnreadByUserId(userId);
    return {
      data: result,
    };
  }
}
