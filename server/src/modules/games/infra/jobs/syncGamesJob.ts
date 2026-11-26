import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import type { IApiMatchService } from '../machApi';
import CreateGameUseCase from '../../application/usecase/CreateGameUseCase';

@Injectable()
export default class SyncGamesJob {
  private readonly logger = new Logger(SyncGamesJob.name);

  constructor(
    @Inject('IApiMatchService')
    private readonly apiMatchService: IApiMatchService,
    private readonly createGameUseCase: CreateGameUseCase,
  ) {}

  @Cron('*/3 * * * *')
  public async execute(): Promise<void> {
    this.logger.log('Starting games synchronization...');

    try {
      const matches = await this.apiMatchService.getMatches();

      this.logger.log(`${matches.length} games received from API`);

      let created = 0;
      let existing = 0;

      for (const match of matches) {
        const before = await this.createGameUseCase.handle({
          externId: match.id,
          key: match.league,
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          startAt: match.startAt,
          odds: match.odds,
          scores: match.scores,
        });

        if (before.createdAt.getTime() === before.updatedAt.getTime()) {
          created++;
        } else {
          existing++;
        }
      }

      this.logger.log(
        `Games synchronization finished. Created: ${created}, Existing: ${existing}`,
      );
    } catch (error) {
      this.logger.error(
        'Error synchronizing games',
        error instanceof Error ? error.stack : error,
      );
    }
  }
}
