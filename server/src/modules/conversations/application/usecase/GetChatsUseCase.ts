import { Inject, Injectable } from '@nestjs/common';
import Id from '@/shared/entities/Id';
import { PaginationInput } from '@/shared/types';
import ConversationRepo from '../repositories/ConversationRepo';

interface GetChatsInput {
  userId: Id;
  isAdmin: boolean;
  pagination: PaginationInput;
}

@Injectable()
export default class GetChatsUseCase {
  constructor(
    @Inject('ConversationRepo')
    private readonly conversationRepo: ConversationRepo,
  ) {}

  async handle({ userId, isAdmin, pagination }: GetChatsInput) {
    const result = isAdmin
      ? await this.conversationRepo.getAdminConversations(userId, pagination)
      : await this.conversationRepo.getUserConversations(userId, pagination);

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
