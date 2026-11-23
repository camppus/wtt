/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import {
  Prisma,
  Chat as PrismaChat,
  Message as PrismaMessage,
} from '@prisma/client';

import PrismaService from '@/infra/database/Prisma/prisma.service';
import Id from '@/shared/entities/Id';
import { Pagination, PaginationInput } from '@/shared/types';

import Chat, { ChatProps } from '../../domain/entities/Chat';
import Message, { MessageProps } from '../../domain/entities/Message';
import ConversationRepo from '../../domain/repositories/ConversationRepo';

@Injectable()
export default class PrismaConversationRepo implements ConversationRepo {
  constructor(private readonly prisma: PrismaService) {}
  // CHAT

  public async saveChat(chat: Chat): Promise<void> {
    const data = chat.toEntitie();

    await this.prisma.chat.upsert({
      where: {
        id: data.id.getValue(),
      },
      create: {
        id: data.id.getValue(),
        userId: data.userId.getValue(),
        adminId: data.adminId.getValue(),
      },
      update: {},
    });
  }

  public async getById(id: Id): Promise<Chat | null> {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id: id.getValue(),
      },
    });

    return chat ? this.toChatDomain(chat) : null;
  }

  public async getByUsers(userId: Id, adminId: Id): Promise<Chat | null> {
    const chat = await this.prisma.chat.findUnique({
      where: {
        userId_adminId: {
          userId: userId.getValue(),
          adminId: adminId.getValue(),
        },
      },
    });

    return chat ? this.toChatDomain(chat) : null;
  }

  public async getUserConversations(
    userId: Id,
    pagination: PaginationInput,
  ): Promise<Pagination<Chat>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const where: Prisma.ChatWhereInput = {
      userId: userId.getValue(),
    };

    const [chats, total] = await this.prisma.$transaction([
      this.prisma.chat.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.chat.count({ where }),
    ]);

    return {
      data: chats.map((chat) => this.toChatDomain(chat)),
      total,
      currentPage: page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  public async getAdminConversations(
    adminId: Id,
    pagination: PaginationInput,
  ): Promise<Pagination<Chat>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const where: Prisma.ChatWhereInput = {
      adminId: adminId.getValue(),
    };

    const [chats, total] = await this.prisma.$transaction([
      this.prisma.chat.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.chat.count({ where }),
    ]);

    return {
      data: chats.map((chat) => this.toChatDomain(chat)),
      total,
      currentPage: page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  // MESSAGES

  public async saveMessage(message: Message): Promise<void> {
    const data = message.toEntitie();

    await this.prisma.message.upsert({
      where: {
        id: data.id.getValue(),
      },
      create: {
        id: data.id.getValue(),
        chatId: data.chatId.getValue(),
        senderId: data.senderId.getValue(),
        content: data.content,
        isRead: data.isRead,
      },
      update: {
        content: data.content,
        isRead: data.isRead,
      },
    });
  }

  public async getMessageById(id: Id): Promise<Message | null> {
    const message = await this.prisma.message.findUnique({
      where: {
        id: id.getValue(),
      },
    });

    return message ? this.toMessageDomain(message) : null;
  }

  public async getMessages(
    chatId: Id,
    pagination: PaginationInput,
  ): Promise<Pagination<Message>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const where: Prisma.MessageWhereInput = {
      chatId: chatId.getValue(),
    };

    const [messages, total] = await this.prisma.$transaction([
      this.prisma.message.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.message.count({ where }),
    ]);

    return {
      data: messages.map((message) => this.toMessageDomain(message)),
      total,
      currentPage: page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  public async getUnreadMessages(chatId: Id, userId: Id): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        chatId: chatId.getValue(),
        senderId: {
          not: userId.getValue(),
        },
        isRead: false,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return messages.map((message) => this.toMessageDomain(message));
  }

  public async countUnreadMessages(chatId: Id, userId: Id): Promise<number> {
    return this.prisma.message.count({
      where: {
        chatId: chatId.getValue(),
        senderId: {
          not: userId.getValue(),
        },
        isRead: false,
      },
    });
  }

  public async markMessageAsRead(messageId: Id): Promise<void> {
    await this.prisma.message.updateMany({
      where: {
        id: messageId.getValue(),
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  public async markMessagesAsRead(chatId: Id, senderId: Id): Promise<void> {
    await this.prisma.message.updateMany({
      where: {
        chatId: chatId.getValue(),
        senderId: senderId.getValue(),
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  public async getLastMessage(chatId: Id): Promise<Message | null> {
    const message = await this.prisma.message.findFirst({
      where: {
        chatId: chatId.getValue(),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return message ? this.toMessageDomain(message) : null;
  }

  private toChatDomain(data: PrismaChat): Chat {
    const props: ChatProps = {
      id: new Id(data.id),
      userId: new Id(data.userId),
      adminId: new Id(data.adminId),
      messages: [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    return new Chat(props);
  }

  private toMessageDomain(data: PrismaMessage): Message {
    const props: MessageProps = {
      id: new Id(data.id),
      chatId: new Id(data.chatId),
      senderId: new Id(data.senderId),
      content: data.content,
      isRead: data.isRead,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    return new Message(props);
  }
}
