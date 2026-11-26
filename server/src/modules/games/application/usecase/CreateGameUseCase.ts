import { Inject, Injectable } from '@nestjs/common';
import type GameRepo from '../../domain/repositories/GameRepo';
import Game, {
  GameProps,
  Odd,
  OddType,
  MatchStatus,
  Score,
} from '../../domain/entities/Game';
import Id from '@/shared/entities/Id';

export interface CreateGameDto {
  externId: string;
  key: string;
  homeTeam: string;
  awayTeam: string;
  startAt: Date;
  odds: Array<{
    type: OddType;
    value: number;
  }>;
  scores: Score;
}

@Injectable()
export default class CreateGameUseCase {
  constructor(
    @Inject('GameRepo')
    private readonly repo: GameRepo,
  ) {}

  public async handle(dto: CreateGameDto): Promise<GameProps> {
    const existingGame = await this.repo.getByExternId(dto.externId);

    if (existingGame) {
      return existingGame.toEntity();
    }

    const now = new Date();
    const gameId = Id.generate();

    const odds: Odd[] = (dto.odds ?? []).map((odd) => ({
      type: odd.type,
      value: odd.value,
    }));

    const game = new Game({
      id: gameId,
      externId: dto.externId,
      key: dto.key,
      homeTeam: dto.homeTeam,
      awayTeam: dto.awayTeam,
      startAt: dto.startAt,
      status: MatchStatus.OPEN,
      completed: false,
      scores: dto.scores,
      odds,
      createdAt: now,
      updatedAt: now,
    });

    await this.repo.save(game);

    return game.toEntity();
  }
}
