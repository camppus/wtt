import { Module } from '@nestjs/common';
import ConversationController from './infra/http/conversationController';
import PrismaConversationRepo from './infra/persistence/PrismaConversationRepo';
import JoinChatUseCase from './application/usecase/JoinChatUseCase';
import GetChatUseCase from './application/usecase/GetChatUseCase';
import GetMessageByChatUseCase from './application/usecase/GetMessageByChatUseCase';
import SendMessageUseCase from './application/usecase/SendMessageUseCase';
import ConversationGateway from './infra/websocket/ConversationGateway';
import GetChatsUseCase from './application/usecase/GetChatsUseCase';
import UserModule from '../users/infra/http/userModule';

@Module({
  controllers: [ConversationController],

  providers: [
    {
      provide: 'ConversationRepo',
      useClass: PrismaConversationRepo,
    },

    JoinChatUseCase,
    GetChatUseCase,
    SendMessageUseCase,
    GetMessageByChatUseCase,
    GetChatsUseCase,
    ConversationGateway,
  ],

  exports: [
    JoinChatUseCase,
    GetChatUseCase,
    SendMessageUseCase,
    GetMessageByChatUseCase,
  ],
  imports: [UserModule],
})
export default class ConversationModule {}
