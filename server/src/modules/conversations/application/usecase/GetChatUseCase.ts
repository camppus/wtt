import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Id from '@/shared/entities/Id';
import ConversationRepo from '../repositories/ConversationRepo';

interface GetChatInput {
  chatId: Id;
  requesterId: Id;
}

@Injectable()
export default class GetChatUseCase {
  constructor(
    @Inject('ConversationRepo')
    private readonly conversationRepo: ConversationRepo,
  ) {}

  async handle({ chatId, requesterId }: GetChatInput) {
    const chat = await this.conversationRepo.getById(chatId);

    if (!chat) {
      throw new NotFoundException('Conversa não encontrada');
    }

    if (!chat.belongsTo(requesterId)) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta conversa',
      );
    }

    const lastMessage = await this.conversationRepo.getLastMessage(chatId);

    return {
      ...chat.toEntitie(),
      lastMessage: lastMessage?.toEntitie() ?? null,
    };
  }
}
