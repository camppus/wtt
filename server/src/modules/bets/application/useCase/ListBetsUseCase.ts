import { Inject, Injectable } from '@nestjs/common';
import Id from '@/shared/entities/Id';
import GetUserByIdUseCase from '@/modules/users/application/usecases/getUserByIdUseCase';
import type BetSlipRepository from '../../domain/repositories/BetSlipRepository';
import { Pagination, PaginationInput } from '@/shared/types';
import BetSlip from '../../domain/entities/BetSlip';

@Injectable()
export default class ListBetsUseCase {
  constructor(
    private readonly getUserUseCase: GetUserByIdUseCase,
    @Inject('BetSlipRepository')
    private readonly betSlipRepo: BetSlipRepository,
  ) {}

  public async handle(userId: Id, pagination: PaginationInput) {
    const user = await this.getUserUseCase.getEntitie(userId);
    let data: Pagination<BetSlip>;
    if (user.isAdmin()) {
      data = await this.betSlipRepo.findAll(pagination);
    } else {
      data = await this.betSlipRepo.findByUserId(userId, pagination);
    }
    return {
      ...data,
      data: data.data.map((bet) => {
        const props = bet.toProps();
        return {
          ...props,
          picks: props.picks.map((pick) => {
            const { game, ...pickProps } = pick.toProps();
            return {
              pick: pickProps,
              game: game.toEntity(),
            };
          }),
        };
      }),
    };
  }
}
