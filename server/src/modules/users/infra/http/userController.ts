import {
  Body,
  Controller,
  Get,
  Put,
  Patch,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import UpdateUserUseCase from '../../application/usecases/updateUserUseCase';
import GetUserByIdUseCase from '../../application/usecases/getUserByIdUseCase';
import GetUsersUseCase from '../../application/usecases/getUsersUseCase';
import Id from '@/shared/entities/Id';
import { UpdatUserDto } from '../../application/dto/updateUserDto';
import ToogleUserUseCase from '../../application/usecases/toogleuserUseCase';
import IsAdminGuard from '@/modules/auth/infra/http/isAdminGuard';
import { CurrentUserId } from '@/modules/auth/infra/http/userContextDecorator';
import IsActiveUserGuard from '@/modules/auth/infra/http/userStatusGuard';

@ApiTags('Users')
@Controller('users')
@UseGuards(IsActiveUserGuard)
export class UserController {
  constructor(
    private readonly updateUserUc: UpdateUserUseCase,
    private readonly getUserByIdUC: GetUserByIdUseCase,
    private readonly getUsersUC: GetUsersUseCase,
    private readonly toggleUserUc: ToogleUserUseCase,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Obtém dados do usuário atual' })
  @ApiResponse({ status: 200, description: 'Dados do usuário atual' })
  async getMe(@CurrentUserId() userId: string) {
    return await this.getUserByIdUC.handle(new Id(userId));
  }

  @Get()
  @UseGuards(IsAdminGuard)
  @ApiOperation({ summary: 'Lista usuários paginados' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Lista de usuários' })
  async getAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return await this.getUsersUC.handle({
      limit,
      page,
    });
  }

  @Put()
  @ApiOperation({ summary: 'Atualiza um usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado' })
  async update(@CurrentUserId() userId: string, @Body() dto: UpdatUserDto) {
    return await this.updateUserUc.handle(new Id(userId), dto);
  }

  @Patch('toggle/:id')
  @UseGuards(IsAdminGuard)
  @ApiOperation({ summary: 'Ativa ou desativa um usuário' })
  @ApiResponse({ status: 200, description: 'Usuário alternado' })
  async toggle(@Param('id') userId: string) {
    return await this.toggleUserUc.handle(new Id(userId));
  }
}
