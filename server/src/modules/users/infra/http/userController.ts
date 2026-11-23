import { Body, Controller, Get, Post, Put, Patch, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import CreateUserUseCase from '../../application/usecases/createUserUseCase';
import UpdateUserUseCase from '../../application/usecases/updateUserUseCase';
import GetUserByIdUseCase from '../../application/usecases/getUserByIdUseCase';
import GetUsersUseCase from '../../application/usecases/getUsersUseCase';
import { CreateUserDto } from '../../application/dto/createUserDto';
import Id from '@/shared/entities/Id';
import { UpdatUserDto } from '../../application/dto/updateUserDto';
import ToogleUserUseCase from '../../application/usecases/toogleuserUseCase';
import { CurrentUserId } from '@/infra/http/decorators/userId.decorator';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUc: CreateUserUseCase,
    private readonly updateUserUc: UpdateUserUseCase,
    private readonly getUserByIdUC: GetUserByIdUseCase,
    private readonly getUsersUC: GetUsersUseCase,
    private readonly toggleUserUc: ToogleUserUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Cria um novo usuário e envia código de verificação',
  })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  async create(@Body() dto: CreateUserDto) {
    return await this.createUserUc.handle(dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Obtém dados do usuário atual' })
  @ApiResponse({ status: 200, description: 'Dados do usuário atual' })
  async getMe(@CurrentUserId() userId: string) {
    return await this.getUserByIdUC.handle(new Id(userId));
  }

  @Get()
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
  @ApiOperation({ summary: 'Ativa ou desativa um usuário' })
  @ApiResponse({ status: 200, description: 'Usuário alternado' })
  async toggle(@CurrentUserId() userId: string) {
    return await this.toggleUserUc.handle(new Id(userId));
  }
}
