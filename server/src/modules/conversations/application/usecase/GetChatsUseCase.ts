import { Inject, Injectable } from '@nestjs/common';
import Id from '@/shared/entities/Id';
import { PaginationInput } from '@/shared/types';
import type ConversationRepo from '../../domain/repositories/ConversationRepo';

interface GetChatsInput {
  userId: Id;
  pagination: PaginationInput;
}

@Injectable()
export default class GetChatsUseCase {
  constructor(
    @Inject('ConversationRepo')
    private readonly conversationRepo: ConversationRepo,
  ) {}

  async handle({ userId, pagination }: GetChatsInput) {
    const result = await this.conversationRepo.getUserConversations(
      userId,
      pagination,
    );

    const data = await Promise.all(
      result.data.map(async (chat) => {
        const lastMessage = await this.conversationRepo.getLastMessage(
          chat.toEntitie().id,
        );

        return {
          ...chat.toEntitie(),
          lastMessage: lastMessage?.toEntitie() ?? null,
        };
      }),
    );

    return {
      ...result,
      data,
    };
  }
}
