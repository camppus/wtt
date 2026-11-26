import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import type { PaginationInput } from '@/shared/types';
import GetGameUseCase from '../../application/usecase/GetGameUseCase';
import GetGamesUseCase from '../../application/usecase/GetGamesUseCase';
import IsActiveUserGuard from '@/modules/auth/infra/http/userStatusGuard';

@Controller('games')
@UseGuards(IsActiveUserGuard)
export default class GameController {
  constructor(
    private readonly getGameUseCase: GetGameUseCase,
    private readonly getGamesUseCase: GetGamesUseCase,
  ) {}

  @Get()
  public async list(@Query() pagination: PaginationInput) {
    return this.getGamesUseCase.handle(pagination);
  }

  @Get(':id')
  public async getById(@Param('id') id: string) {
    return this.getGameUseCase.handle(id);
  }
}
