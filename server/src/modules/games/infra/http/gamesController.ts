import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import type { PaginationInput } from '@/shared/types';
import IsActiveUserGuard from '@/modules/auth/infra/http/userStatusGuard';

import GetGameUseCase from '../../application/usecase/GetGameUseCase';
import GetGamesUseCase from '../../application/usecase/GetGamesUseCase';

@ApiTags('Games')
@Controller('games')
@UseGuards(IsActiveUserGuard)
export default class GameController {
  constructor(
    private readonly getGameUseCase: GetGameUseCase,
    private readonly getGamesUseCase: GetGamesUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar jogos',
    description: 'Retorna uma lista paginada de jogos disponíveis.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Número da página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Quantidade de jogos por página',
  })
  public async list(@Query() pagination: PaginationInput) {
    return this.getGamesUseCase.handle(pagination);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar jogo por ID',
    description: 'Retorna os detalhes de um jogo específico.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do jogo',
    example: 'c8f4e3b2-7c91-4d5a-9f21-8e6b4a2c1d09',
  })
  public async getById(@Param('id') id: string) {
    return this.getGameUseCase.handle(id);
  }
}
