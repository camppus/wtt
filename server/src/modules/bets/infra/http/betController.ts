import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import CreateBetSlipDto from '../../application/dto/createBetSlipDto';
import CreateBetSlipUseCase from '../../application/useCase/CreateBetSlipUseCase';
import GetBetByIdUseCase from '../../application/useCase/GetBetByIdUseCase';
import GetUserProgrationUseCase from '../../application/useCase/GetUserProgrationUseCase';
import ListBetsUseCase from '../../application/useCase/ListBetsUseCase';
import { CurrentUserId } from '@/modules/auth/infra/http/userContextDecorator';
import Id from '@/shared/entities/Id';
import IsActiveUserGuard from '@/modules/auth/infra/http/userStatusGuard';
import type { PaginationInput } from '@/shared/types';

@ApiTags('Bet')
@ApiBearerAuth()
@Controller('bet')
@UseGuards(IsActiveUserGuard)
export default class BetController {
  constructor(
    private readonly createBetSlipUseCase: CreateBetSlipUseCase,
    private readonly getBetByIdUseCase: GetBetByIdUseCase,
    private readonly getUserProgressionUseCase: GetUserProgrationUseCase,
    private readonly listBetsUseCase: ListBetsUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Criar uma aposta',
    description:
      'Cria uma nova aposta para o utilizador autenticado. ' +
      'Quando o utilizador está em LOOPING, a aposta pode ser processada como aposta grátis.',
  })
  async create(@CurrentUserId() userId: string, @Body() dto: CreateBetSlipDto) {
    return this.createBetSlipUseCase.handle(dto, new Id(userId));
  }

  @Get()
  @ApiOperation({
    summary: 'Listar apostas',
    description: 'Lista as apostas do utilizador autenticado com paginação.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Número da página.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Quantidade de apostas por página.',
  })
  async list(@CurrentUserId() userId: string, @Query() query: PaginationInput) {
    return this.listBetsUseCase.handle(new Id(userId), query);
  }

  @Get('progression')
  @ApiOperation({
    summary: 'Obter progressão de apostas',
    description:
      'Retorna a progressão atual do utilizador. ' +
      'Caso não exista uma progressão ativa, uma nova progressão é criada.',
  })
  async progression(@CurrentUserId() userId: string) {
    return this.getUserProgressionUseCase.handle(new Id(userId));
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter aposta por ID',
    description: 'Retorna os detalhes de uma aposta específica.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: '01JABC123XYZ',
    description: 'Identificador da aposta.',
  })
  async findById(@Param('id') id: string, @CurrentUserId() userId: string) {
    return this.getBetByIdUseCase.handle(new Id(userId), new Id(id));
  }
}
