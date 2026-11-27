import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import type { PaginationInput } from '@/shared/types';
import GetNotification from '../../application/usecases/GetNotification';
import ListNotifications from '../../application/usecases/ListNotifications';
import GetUnreadNotifications from '../../application/usecases/GetUnreadNotifications';
import ReadNotification from '../../application/usecases/ReadNotification';
import { CurrentUserId } from '@/modules/auth/infra/http/userContextDecorator';

@ApiTags('Notifications')
@Controller('notifications')
export default class NotificationController {
  constructor(
    private readonly getNotification: GetNotification,
    private readonly listNotifications: ListNotifications,
    private readonly getUnreadNotifications: GetUnreadNotifications,
    private readonly readNotification: ReadNotification,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar notificações',
  })
  async list(@CurrentUserId() userId: string, @Query() query: PaginationInput) {
    return this.listNotifications.execute(userId, query);
  }

  @Get('unread')
  @ApiOperation({
    summary: 'Número de não lidas',
  })
  async unread(@CurrentUserId() userId: string) {
    return this.getUnreadNotifications.execute(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter uma notificação',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da notificação',
  })
  async get(
    @CurrentUserId() userId: string,
    @Param('id') notificationId: string,
  ) {
    return this.getNotification.execute(userId, notificationId);
  }

  @Patch(':id/read')
  @ApiOperation({
    summary: 'Marcar notificação como lida',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da notificação',
  })
  async read(
    @CurrentUserId() userId: string,
    @Param('id') notificationId: string,
  ): Promise<void> {
    await this.readNotification.execute(userId, notificationId);
  }
}
