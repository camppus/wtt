import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type BetSlipRepository from '../../domain/repositories/BetSlipRepository';
import type BetPickRepository from '../../domain/repositories/BetPickRepository';
import GetUserProgrationUseCase from './GetUserProgrationUseCase';
import GetUserByIdUseCase from '@/modules/users/application/usecases/getUserByIdUseCase';
import type UserRepo from '@/modules/users/domain/repositories/UserRepo';
import CreateLedgerEntryUseCase from '@/modules/transactions/application/usecase/CreateLedgerEntry';
import { EventEmitter2 } from '@nestjs/event-emitter';
import CreateBetSlipDto from '../dto/createBetSlipDto';
import Id from '@/shared/entities/Id';
import Money from '@/shared/entities/Money';
import BetPick, { BetPickStatus } from '../../domain/entities/BetPick';
import BetSlip, { BetSlipStatus } from '../../domain/entities/BetSlip';
import ResolvePickService from '../../domain/service/resolvePickService';

@Injectable()
export default class CreateBetSlipUseCase {
  constructor(
    @Inject('BetSlipRepository')
    private readonly betSlipRepo: BetSlipRepository,
    @Inject('BetPickRepository')
    private readonly betPickRepo: BetPickRepository,
    @Inject('UserRepo')
    private readonly userRepo: UserRepo,
    private readonly resolvePickService: ResolvePickService,
    private readonly getUserBetingProgration: GetUserProgrationUseCase,
    private readonly getUserUc: GetUserByIdUseCase,
    private readonly registerLedger: CreateLedgerEntryUseCase,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async handle(dto: CreateBetSlipDto, userId: Id) {
    const { amount, picks } = dto;

    if (!picks?.length) {
      throw new BadRequestException('A aposta precisa ter pelo menos um jogo');
    }
    const payable = new Money(amount);

    if (payable.isZero() || payable.isNegative()) {
      throw new BadRequestException('O valor da aposta deve ser positivo');
    }

    const matchIds = picks.map((pick) => pick.matchId);

    if (new Set(matchIds).size !== matchIds.length) {
      throw new BadRequestException(
        'Não podes selecionar o mesmo jogo mais de uma vez',
      );
    }

    const [userProgression, user] = await Promise.all([
      this.getUserBetingProgration.handle(userId),
      this.getUserUc.getEntitie(userId),
    ]);

    if (user.getbalance().getValue() < payable.getValue()) {
      throw new BadRequestException('Saldo insuficiente');
    }

    const validatedPicks = await this.resolvePickService.handle(
      picks,
      userProgression,
    );

    const betCreationDate = new Date();
    const betSlipId = Id.generate();
    const betPicks: BetPick[] = validatedPicks.map((pick) => {
      return new BetPick({
        id: Id.generate(),
        betSlipId,
        game: pick.game,
        matchId: pick.matchId,
        oddType: pick.oddType,
        oddValue: pick.oddValue,
        status: BetPickStatus.PENDING,
        createdAt: betCreationDate,
        updatedAt: betCreationDate,
      });
    });

    const totalOdd = betPicks.reduce(
      (total, pick) => total * pick.getOddValue(),
      1,
    );
    const possibleWin = new Money(payable.getValue() * totalOdd);
    const betSlip = new BetSlip({
      id: betSlipId,
      userId: user.getId(),
      picks: betPicks,
      stake: payable,
      possibleWin,
      totalOdd,
      status: BetSlipStatus.PENDING,
      createdAt: betCreationDate,
      updatedAt: betCreationDate,
      resolvedAt: undefined,
    });

    return {
      betSlip,
      betPicks,
      totalOdd,
      possibleWin,
    };
  }
}
