import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import type GameRepo from '../../domain/repositories/GameRepo';
import type { IApiMatchService } from '../machApi';
import UpdateGameUseCase from '../../application/usecase/UpdateGameUseCase';

@Injectable()
export default class UpdateLiveGamesJob {
  private readonly logger = new Logger(UpdateLiveGamesJob.name);

  constructor(
    @Inject('GameRepo')
    private readonly gameRepo: GameRepo,

    @Inject('IApiMatchService')
    private readonly apiMatchService: IApiMatchService,

    private readonly updateGameUseCase: UpdateGameUseCase,
  ) {}

  @Cron('*/3 * * * *')
  public async execute(): Promise<void> {
    try {
      const now = new Date();
      const games = await this.gameRepo.getLiveGames(now);
      if (games.length === 0) {
        return;
      }
      const externalMatches = await this.apiMatchService.getMatches();
      for (const game of games) {
        const match = externalMatches.find(
          (match) => match.id === game.getExternId(),
        );
        if (!match) {
          continue;
        }
        if (!match.scores.length) {
          continue;
        }
        const score = match.scores[0];

        await this.updateGameUseCase.handle({
          gameId: game.getId().getValue(),
          scores: [score],
        });
      }

      this.logger.log(`Updated ${games.length} live games`);
    } catch (error) {
      this.logger.error(
        'Failed to update live games',
        error instanceof Error ? error.stack : error,
      );
    }
  }
}
