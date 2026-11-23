import { Inject, Injectable } from '@nestjs/common';
import type GameRepo from '../../domain/repositories/GameRepo';
import { Pagination, PaginationInput } from '@/shared/types';
import Game from '../../domain/entities/Game';

@Injectable()
export default class GetGamesUseCase {
  constructor(
    @Inject('GameRepo')
    private readonly repo: GameRepo,
  ) {}

  public async handle(pagination: PaginationInput): Promise<Pagination<Game>> {
    return this.repo.getAll(pagination);
  }
}
