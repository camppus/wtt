import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Id from '@/shared/entities/Id';
import { PaginationInput } from '@/shared/types';
import type ConversationRepo from '../../domain/repositories/ConversationRepo';

interface GetMessageByChatInput {
  chatId: Id;
  requesterId: Id;
  pagination: PaginationInput;
}

@Injectable()
export default class GetMessageByChatUseCase {
  constructor(
    @Inject('ConversationRepo')
    private readonly conversationRepo: ConversationRepo,
  ) {}

  async handle({ chatId, requesterId, pagination }: GetMessageByChatInput) {
    const chat = await this.conversationRepo.getById(chatId);

    if (!chat) {
      throw new NotFoundException('Conversa não encontrada');
    }

    if (!chat.belongsTo(requesterId)) {
      throw new ForbiddenException('Você não participa desta conversa');
    }

    const otherParticipantId = chat.isUser(requesterId)
      ? chat.getAdminId()
      : chat.getUserId();

    await this.conversationRepo.markMessagesAsRead(chatId, otherParticipantId);

    return this.conversationRepo.getMessages(chatId, pagination);
  }
}
