import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type GameRepo from '../../domain/repositories/GameRepo';
import Game, { GameProps } from '../../domain/entities/Game';
import Id from '@/shared/entities/Id';

@Injectable()
export default class GetGameUseCase {
  constructor(
    @Inject('GameRepo')
    private readonly repo: GameRepo,
  ) {}

  public async handle(id: string): Promise<GameProps> {
    const game = await this.repo.getById(new Id(id));

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    return game.toEntity();
  }

  public async getEntitie(id: Id): Promise<Game> {
    const game = await this.repo.getById(id);

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    return game;
  }
}
