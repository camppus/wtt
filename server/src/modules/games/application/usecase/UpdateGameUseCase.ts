import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type GameRepo from '../../domain/repositories/GameRepo';
import Id from '@/shared/entities/Id';
import { GameProps, Score } from '../../domain/entities/Game';

export interface UpdateGameDto {
  gameId: string;
  scores: Score[];
}

@Injectable()
export default class UpdateGameUseCase {
  constructor(
    @Inject('GameRepo')
    private readonly repo: GameRepo,
  ) {}

  public async handle(dto: UpdateGameDto): Promise<GameProps> {
    const game = await this.repo.getById(new Id(dto.gameId));

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    game.updateScores(dto.scores);

    await this.repo.save(game);

    return game.toEntity();
  }
}
