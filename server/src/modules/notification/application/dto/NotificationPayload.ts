import { NotificationType } from '../../domain/entities/Notification';

export interface NotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
}
