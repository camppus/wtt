import { Inject, Injectable } from '@nestjs/common';
import Id from '@/shared/entities/Id';
import Chat from '../entities/Chat';
import ConversationRepo from '../repositories/ConversationRepo';

interface JoinChatInput {
  userId: Id;
  adminId: Id;
}

@Injectable()
export default class JoinChatUseCase {
  constructor(
    @Inject('ConversationRepo')
    private readonly conversationRepo: ConversationRepo,
  ) {}

  async handle({ userId, adminId }: JoinChatInput) {
    const existingChat = await this.conversationRepo.getByUsers(
      userId,
      adminId,
    );

    if (existingChat) {
      return existingChat;
    }

    const now = new Date();

    const chat = new Chat({
      id: new Id(crypto.randomUUID()),
      userId,
      adminId,
      messages: [],
      createdAt: now,
      updatedAt: now,
    });

    await this.conversationRepo.save(chat);

    return chat;
  }
}
