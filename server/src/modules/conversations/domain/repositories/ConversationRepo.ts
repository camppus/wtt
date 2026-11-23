import Id from '@/shared/entities/Id';
import { Pagination, PaginationInput } from '@/shared/types';
import Chat from '../entities/Chat';
import Message from '../entities/Message';
export default interface ConversationRepo {
  // Chat
  saveChat(chat: Chat): Promise<void>;
  getById(id: Id): Promise<Chat | null>;
  getByUsers(userId: Id, adminId: Id): Promise<Chat | null>;
  getUserConversations(
    userId: Id,
    pagination: PaginationInput,
  ): Promise<Pagination<Chat>>;
  saveMessage(message: Message): Promise<void>;
  getMessages(
    chatId: Id,
    pagination: PaginationInput,
  ): Promise<Pagination<Message>>;
  getUnreadMessages(chatId: Id, userId: Id): Promise<Message[]>;
  countUnreadMessages(chatId: Id, userId: Id): Promise<number>;
  markMessageAsRead(messageId: Id): Promise<void>;
  markMessagesAsRead(chatId: Id, senderId: Id): Promise<void>;
  getLastMessage(chatId: Id): Promise<Message | null>;
}
