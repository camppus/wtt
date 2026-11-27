import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import NotificationController from './infra/http/NotificationController';
import PrismaNotificationRepository from './infra/persistence/PrismaNotificationRepository';
import CreateNotificationUseCase from './application/usecases/createNotificationUseCase';
import GetNotification from './application/usecases/GetNotification';
import GetUnreadNotifications from './application/usecases/GetUnreadNotifications';
import ListNotifications from './application/usecases/ListNotifications';
import ReadNotification from './application/usecases/ReadNotification';
import NotificationHandler from './application/handlers/NotificationHandler';

@Module({
  imports: [EventEmitterModule],
  controllers: [NotificationController],
  providers: [
    CreateNotificationUseCase,
    GetNotification,
    GetUnreadNotifications,
    ListNotifications,
    ReadNotification,
    NotificationHandler,
    PrismaNotificationRepository,
    NotificationHandler,
    {
      provide: 'NotificationRepository',
      useExisting: PrismaNotificationRepository,
    },
  ],
  exports: [CreateNotificationUseCase, 'NotificationRepository'],
})
export default class NotificationModule {}
