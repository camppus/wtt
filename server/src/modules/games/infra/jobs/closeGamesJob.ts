import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import type GameRepo from '../../domain/repositories/GameRepo';
import CloseGameUseCase from '../../application/usecase/CloseGameUseCase';

@Injectable()
export default class CloseGamesJob {
  private readonly logger = new Logger(CloseGamesJob.name);

  constructor(
    @Inject('GameRepo')
    private readonly repo: GameRepo,

    private readonly closeGameUseCase: CloseGameUseCase,
  ) {}

  @Cron('*/3 * * * *')
  public async execute(): Promise<void> {
    const now = new Date();

    try {
      const games = await this.repo.getGamesToClose(now);
      this.logger.log(`Found ${games.length} games to close`);
      if (games.length === 0) {
        return;
      }
      for (const game of games) {
        try {
          await this.closeGameUseCase.handle(game.getId().getValue());
          this.logger.verbose(`Game ${game.getId().getValue()} closed`);
        } catch (error) {
          this.logger.error(
            `Failed to close game ${game.getId().getValue()}`,
            error instanceof Error ? error.stack : error,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        'Failed to fetch games to close',
        error instanceof Error ? error.stack : error,
      );
    }
  }
}
