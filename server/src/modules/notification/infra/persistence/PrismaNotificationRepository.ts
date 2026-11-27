import { Injectable } from '@nestjs/common';
import Notification, {
  NotificationProps,
  NotificationType,
} from '../../domain/entities/Notification';

import NotificationRepository from '../../domain/repositories/NotificationRepository';
import PrimaService from '@/infra/database/Prisma/prisma.service';
import { Pagination, PaginationInput } from '@/shared/types';
import { getPagination } from '@/shared/lib';
import {
  Notification as PrismaNotification,
  NotificationType as PrismaNotificationType,
} from '@prisma/client';

@Injectable()
export default class PrismaNotificationRepository implements NotificationRepository {
  constructor(private readonly prisma: PrimaService) {}
  async findByUserId(
    userId: string,
    options: PaginationInput,
  ): Promise<Pagination<Notification>> {
    const { limit, page, skip } = getPagination(options);
    const [total, notifications] = await Promise.all([
      this.prisma.notification.count({
        where: {
          userId,
        },
      }),
      this.prisma.notification.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: skip,
      }),
    ]);

    return {
      currentPage: page,
      lastPage: Math.ceil(total / limit),
      data: notifications.map((notification) =>
        Notification.restore(this.toDomain(notification)),
      ),
      limit,
      total,
    };
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id,
      },
    });

    if (!notification) {
      return null;
    }

    return Notification.restore(this.toDomain(notification));
  }

  async countUnreadByUserId(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  async save(notification: Notification): Promise<void> {
    const data = notification.toPrimitives();

    await this.prisma.notification.upsert({
      create: {
        id: data.id,
        userId: data.userId,
        type: data.type as PrismaNotificationType,
        title: data.title,
        message: data.message,
        isRead: data.isRead,
        createdAt: data.createdAt,
      },
      update: {
        id: data.id,
        userId: data.userId,
        type: data.type as PrismaNotificationType,
        title: data.title,
        message: data.message,
        isRead: data.isRead,
        createdAt: data.createdAt,
      },
      where: {
        id: data.id,
      },
    });
  }

  private toDomain(notification: PrismaNotification): NotificationProps {
    return {
      id: notification.id,
      userId: notification.userId,
      type: notification.type as NotificationType,
      title: notification.title,
      message: notification.message,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
    };
  }
}
