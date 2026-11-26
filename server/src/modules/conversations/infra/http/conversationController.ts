import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import JoinChatUseCase from '../../application/usecase/JoinChatUseCase';
import Id from '@/shared/entities/Id';
import GetChatsUseCase from '../../application/usecase/GetChatsUseCase';
import GetChatUseCase from '../../application/usecase/GetChatUseCase';
import { CurrentUserId } from '@/modules/auth/infra/http/userContextDecorator';
import IsActiveUserGuard from '@/modules/auth/infra/http/userStatusGuard';

@Controller('conversation')
@UseGuards(IsActiveUserGuard)
export default class ConversationController {
  constructor(
    private readonly joinChatUc: JoinChatUseCase,
    private readonly listChatsUC: GetChatsUseCase,
    private readonly getChatUC: GetChatUseCase,
  ) {}

  @Post('/join')
  @ApiOperation({
    summary: 'Entrar em um chat com admin',
  })
  public async join(@CurrentUserId() userId: string) {
    return await this.joinChatUc.handle(new Id(userId));
  }

  @Get('/chats')
  @ApiOperation({
    summary: 'Listar meus chats',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  public async getMyChats(
    @CurrentUserId() userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit = 10,
  ) {
    return await this.listChatsUC.handle({
      userId: new Id(userId),
      pagination: {
        limit,
        page,
      },
    });
  }

  @Get('/chats/:id')
  @ApiOperation({
    summary: 'Listar meus chats',
  })
  public async getChat(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
  ) {
    return await this.getChatUC.handle({
      chatId: new Id(id),
      requesterId: new Id(userId),
    });
  }
}
