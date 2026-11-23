import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Id from '@/shared/entities/Id';
import Message from '../entities/Message';
import ConversationRepo from '../repositories/ConversationRepo';

interface SendMessageInput {
  chatId: Id;
  senderId: Id;
  content: string;
}

@Injectable()
export default class SendMessageUseCase {
  constructor(
    @Inject('ConversationRepo')
    private readonly conversationRepo: ConversationRepo,
  ) {}

  async handle({ chatId, senderId, content }: SendMessageInput) {
    const chat = await this.conversationRepo.getById(chatId);

    if (!chat) {
      throw new NotFoundException('Conversa não encontrada');
    }

    if (!chat.belongsTo(senderId)) {
      throw new ForbiddenException('Você não participa desta conversa');
    }

    if (!content.trim()) {
      throw new Error('A mensagem não pode estar vazia');
    }

    const now = new Date();

    const message = new Message({
      id: new Id(crypto.randomUUID()),
      chatId,
      senderId,
      content: content.trim(),
      isRead: false,
      createdAt: now,
      updatedAt: now,
    });

    await this.conversationRepo.saveMessage(message);

    return message;
  }
}
