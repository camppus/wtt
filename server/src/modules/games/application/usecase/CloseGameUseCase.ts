import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type GameRepo from '../../domain/repositories/GameRepo';
import Id from '@/shared/entities/Id';
import { GameProps } from '../../domain/entities/Game';

@Injectable()
export default class CloseGameUseCase {
  constructor(
    @Inject('GameRepo')
    private readonly repo: GameRepo,
  ) {}

  public async handle(id: string): Promise<GameProps> {
    const game = await this.repo.getById(new Id(id));

    if (!game) {
      throw new NotFoundException('Game not found');
    }
    game.close();
    await this.repo.save(game);
    return game.toEntity();
  }
}
