import { Inject, Injectable } from '@nestjs/common';
import Id from '@/shared/entities/Id';
import type ConversationRepo from '../../domain/repositories/ConversationRepo';
import type UserRepo from '@/modules/users/domain/repositories/UserRepo';
import Chat from '../../domain/entities/Chat';

@Injectable()
export default class JoinChatUseCase {
  constructor(
    @Inject('ConversationRepo')
    private readonly conversationRepo: ConversationRepo,
    @Inject('UserRepo')
    private readonly userRepo: UserRepo,
  ) {}

  async handle(userId: Id) {
    const admin = await this.userRepo.getAdmin();

    if (!admin) {
      throw new Error('Admin not found');
    }

    const existingChat = await this.conversationRepo.getByUsers(
      userId,
      admin.getId(),
    );

    if (existingChat) {
      return existingChat;
    }

    const now = new Date();
    const chat = new Chat({
      id: new Id(crypto.randomUUID()),
      userId,
      adminId: admin.getId(),
      messages: [],
      createdAt: now,
      updatedAt: now,
    });

    await this.conversationRepo.saveChat(chat);
    return chat;
  }
}
