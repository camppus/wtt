import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type BetSlipRepository from '../../domain/repositories/BetSlipRepository';
import GetUserProgrationUseCase from './GetUserProgrationUseCase';
import GetUserByIdUseCase from '@/modules/users/application/usecases/getUserByIdUseCase';
import { EventEmitter2 } from '@nestjs/event-emitter';
import CreateBetSlipDto from '../dto/createBetSlipDto';
import Id from '@/shared/entities/Id';
import Money from '@/shared/entities/Money';
import BetPick, { BetPickStatus } from '../../domain/entities/BetPick';
import BetSlip from '../../domain/entities/BetSlip';
import ResolvePickService from '../../domain/service/resolvePickService';
import LedgerEntry, {
  LedgerEntryDirection,
  LedgerEntryType,
} from '@/modules/transactions/domain/entities/LedgerEntry';
import { NotificationEvents } from '@/modules/notification/domain/events/NotificationEvent';
import PickResolveService from '../../domain/service/pickResolveService';

@Injectable()
export default class CreateBetSlipUseCase {
  constructor(
    @Inject('BetSlipRepository')
    private readonly betRepo: BetSlipRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly resolvePickService: ResolvePickService,
    private readonly getUserBetingProgration: GetUserProgrationUseCase,
    private readonly getUserUc: GetUserByIdUseCase,
    private readonly pickResolveService: PickResolveService,
  ) {}

  public async handle(dto: CreateBetSlipDto, userId: Id) {
    const { amount, picks } = dto;
    this.pickResolveService.handle(picks);
    const requestedAmount = new Money(amount);
    const [userProgression, user] = await Promise.all([
      this.getUserBetingProgration.handle(userId),
      this.getUserUc.getEntitie(userId),
    ]);

    const isInLoop = userProgression.isInLooping();
    let payable: Money;

    if (isInLoop) {
      const hasBetToday = await this.betRepo.hasBetToday(userId);
      if (hasBetToday) {
        throw new BadRequestException('Já utilizou a sua aposta gratuita hoje');
      }
      payable = Money.zero();
    } else {
      Money.ensureIsPayable(requestedAmount.getValue());
      payable = requestedAmount;
      if (!user.hasSuficientBalance(payable)) {
        throw new BadRequestException('Saldo insuficiente');
      }
    }

    const userBalance = user.getbalance();
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
        status: BetPickStatus.PENDING,
        createdAt: betCreationDate,
        updatedAt: betCreationDate,
        oddValue: pick.oddValue,
      });
    });

    const betSlip = BetSlip.create({
      id: betSlipId,
      userId: user.getId(),
      picks: betPicks,
      stake: payable,
      createdAt: betCreationDate,
    });

    const balanceAfter = isInLoop ? userBalance : userBalance.subtract(payable);

    if (balanceAfter.isNegative()) {
      throw new Error('User Balance Error');
    }

    let ledger: LedgerEntry | undefined;
    if (!isInLoop) {
      ledger = new LedgerEntry({
        amount: payable,
        balanceAfter,
        balanceBefore: userBalance,
        createdAt: betCreationDate,
        direction: LedgerEntryDirection.DEBIT,
        id: Id.generate(),
        type: LedgerEntryType.BET_STAKE,
        updatedAt: betCreationDate,
        userId,
        description: `Débito de ${payable.format()} referente à aposta #${betSlip.getStringfiedId()}`,
        referenceId: betSlip.getId(),
      });
    }

    await this.betRepo.transactionalBetCreate({
      bet: betSlip,
      decriseAmount: balanceAfter,
      ledger,
    });

    this.eventEmitter.emit(NotificationEvents.BET_CREATED, {
      userId: user.getStringfiedId(),
      betId: betSlip.getStringfiedId(),
    });

    return {
      sucess: true,
      currentStep: userProgression.currentStep(),
      isFreeBet: isInLoop,
    };
  }
}
