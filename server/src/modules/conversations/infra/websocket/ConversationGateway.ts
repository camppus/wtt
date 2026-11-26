/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

import { Server, Socket } from 'socket.io';

import Id from '@/shared/entities/Id';

import JoinChatUseCase from '../../application/usecase/JoinChatUseCase';
import GetChatUseCase from '../../application/usecase/GetChatUseCase';
import SendMessageUseCase from '../../application/usecase/SendMessageUseCase';
import GetMessageByChatUseCase from '../../application/usecase/GetMessageByChatUseCase';

import Token from '@/infra/security/token';

interface AuthenticatedSocket extends Socket {
  data: {
    userId: string;
    role?: string;
  };
}

interface JoinChatPayload {
  chatId: string;
}

interface SendMessagePayload {
  chatId: string;
  content: string;
}

interface GetMessagesPayload {
  chatId: string;
  page?: number;
  limit?: number;
}

@Injectable()
@WebSocketGateway({
  namespace: '/conversation',
  cors: {
    origin: '*',
  },
})
export default class ConversationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ConversationGateway.name);

  @WebSocketServer()
  private server!: Server;

  constructor(
    private readonly jwtService: Token,
    private readonly joinChatUseCase: JoinChatUseCase,
    private readonly getChatUseCase: GetChatUseCase,
    private readonly sendMessageUseCase: SendMessageUseCase,
    private readonly getMessageByChatUseCase: GetMessageByChatUseCase,
  ) {}

  handleConnection(client: AuthenticatedSocket): void {
    try {
      const token = this.extractToken(client);

      if (!token) {
        throw new UnauthorizedException('Token não informado');
      }

      const isValid = this.jwtService.verify(token);

      if (!isValid) {
        throw new UnauthorizedException('Token inválido');
      }

      const payload = this.jwtService.decode(token);

      if (!payload?.sub) {
        throw new UnauthorizedException('Token inválido');
      }

      client.data.userId = payload.sub;
      client.data.role = payload.role;

      this.logger.log(`Socket conectado: ${client.id} | user: ${payload.sub}`);
    } catch {
      this.logger.warn(`Socket recusado: ${client.id}`);

      client.emit('conversation:error', {
        message: 'Não autenticado',
      });

      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket): void {
    this.logger.log(`Socket desconectado: ${client.id}`);
  }

  @SubscribeMessage('chat:join')
  async join(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() body: JoinChatPayload,
  ) {
    try {
      const requesterId = new Id(client.data.userId);
      const chatId = new Id(body.chatId);

      const chat = await this.getChatUseCase.handle({
        chatId,
        requesterId,
      });

      const room = this.getRoom(body.chatId);

      await client.join(room);

      client.emit('chat:joined', {
        chatId: body.chatId,
      });

      return {
        chat,
      };
    } catch (error) {
      return this.handleError(client, error);
    }
  }

  @SubscribeMessage('chat:join-admin')
  async joinAdmin(@ConnectedSocket() client: AuthenticatedSocket) {
    try {
      if (client.data.role !== 'ADMIN') {
        throw new UnauthorizedException('Acesso negado');
      }

      const userId = new Id(client.data.userId);

      const chat = await this.joinChatUseCase.handle(userId);

      const chatId = chat.toEntitie().id.getValue();
      const room = this.getRoom(chatId);

      await client.join(room);

      client.emit('chat:joined', {
        chatId,
      });

      return {
        chat: chat.toEntitie(),
      };
    } catch (error) {
      return this.handleError(client, error);
    }
  }

  @SubscribeMessage('message:send')
  async sendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() body: SendMessagePayload,
  ) {
    try {
      const senderId = new Id(client.data.userId);
      const chatId = new Id(body.chatId);

      const message = await this.sendMessageUseCase.handle({
        chatId,
        senderId,
        content: body.content,
      });

      const data = message.toEntitie();
      const room = this.getRoom(body.chatId);

      this.server.to(room).emit('message:new', data);

      return {
        message: data,
      };
    } catch (error) {
      return this.handleError(client, error);
    }
  }

  @SubscribeMessage('message:get')
  async getMessages(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() body: GetMessagesPayload,
  ) {
    try {
      const requesterId = new Id(client.data.userId);
      const chatId = new Id(body.chatId);

      const result = await this.getMessageByChatUseCase.handle({
        chatId,
        requesterId,
        pagination: {
          page: Math.max(1, body.page ?? 1),
          limit: Math.min(100, Math.max(1, body.limit ?? 30)),
        },
      });

      return {
        messages: result,
      };
    } catch (error) {
      return this.handleError(client, error);
    }
  }

  private getRoom(chatId: string): string {
    return `chat:${chatId}`;
  }

  private extractToken(client: AuthenticatedSocket): string | null {
    const authToken = client.handshake.auth?.token as string;

    if (authToken) {
      return this.removeBearer(authToken);
    }

    const authorization = client.handshake.headers.authorization as string;

    if (authorization) {
      return this.removeBearer(authorization);
    }

    return null;
  }

  private removeBearer(token: string): string {
    return token.replace(/^Bearer\s+/i, '');
  }

  private handleError(client: AuthenticatedSocket, error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Erro ao processar operação';

    client.emit('conversation:error', {
      message,
    });

    return {
      error: message,
    };
  }
}
