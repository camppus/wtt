import Id from '@/shared/entities/Id';
import BettingProgression from '../../domain/entities/BettingProgression';
import BettingProgressionRepository from '../../domain/repositories/BettingProgressionRepository';
import BetProgressService from '../../domain/service/betProgressService';

export default class GetUserProgressionUseCase {
  constructor(
    private readonly bettingProgressionRepository: BettingProgressionRepository,
    private readonly betProgressService: BetProgressService,
  ) {}

  public async handle(userId: Id): Promise<BettingProgression> {
    const progression =
      await this.bettingProgressionRepository.findActiveByUserId(userId);
    if (progression) {
      return progression;
    }
    return this.betProgressService.registerUserBetProgression(userId);
  }
}
