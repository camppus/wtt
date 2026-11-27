import { PaginationInput, Pagination } from '@/shared/types';
import Notification from '../entities/Notification';

export default interface NotificationRepository {
  findById(id: string): Promise<Notification | null>;
  findByUserId(
    userId: string,
    options: PaginationInput,
  ): Promise<Pagination<Notification>>;
  countUnreadByUserId(userId: string): Promise<number>;
  save(notification: Notification): Promise<void>;
}
