import { Inject, Injectable } from '@nestjs/common';
import type NotificationRepository from '../../domain/repositories/NotificationRepository';
import { Pagination, PaginationInput } from '@/shared/types';
import { NotificationProps } from '../../domain/entities/Notification';

@Injectable()
export default class ListNotifications {
  constructor(
    @Inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(
    userId: string,
    options: PaginationInput,
  ): Promise<Pagination<NotificationProps>> {
    const data = await this.notificationRepository.findByUserId(
      userId,
      options,
    );
    return {
      ...data,
      data: data.data.map((item) => item.toPrimitives()),
    };
  }
}
