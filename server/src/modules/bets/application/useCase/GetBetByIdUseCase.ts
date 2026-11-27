import { Inject, Injectable } from '@nestjs/common';
import type BetSlipRepository from '../../domain/repositories/BetSlipRepository';
import Id from '@/shared/entities/Id';
import GetUserByIdUseCase from '@/modules/users/application/usecases/getUserByIdUseCase';

@Injectable()
export default class GetBetByIdUsecase {
  constructor(
    private readonly getUserUseCase: GetUserByIdUseCase,
    @Inject('BetSlipRepository')
    private readonly betSlipRepo: BetSlipRepository,
  ) {}

  public async handle(userId: Id, betId: Id) {
    const [bet, user] = await Promise.all([
      this.betSlipRepo.findById(betId),
      this.getUserUseCase.getEntitie(userId),
    ]);

    if (!bet) {
      throw new Error('Bet not found');
    }

    const isAdmin = user.isAdmin();
    const belongsToMe = bet.belongsTome(userId);

    if (!isAdmin && !belongsToMe) {
      throw new Error('Access denied');
    }

    const picks = bet.picks().map((pick) => {
      const { game, ...pickProps } = pick.toProps();
      return {
        pick: pickProps,
        game: game.toEntity(),
      };
    });

    return {
      bet: bet.toProps(),
      picks,
    };
  }
}
