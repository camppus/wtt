/* eslint-disable @typescript-eslint/no-unused-vars */
import Id from '@/shared/entities/Id';
import Money from '@/shared/entities/Money';
import BetPick from './BetPick';
import Entity from '@/shared/entities/Entiry';

export enum BetSlipStatus {
  PENDING = 'PENDING',
  WON = 'WON',
  LOST = 'LOST',
  CANCELED = 'CANCELED',
}

export interface BetSlipProps {
  id: Id;
  userId: Id;
  stake: Money;
  totalOdd: number;
  possibleWin: Money;
  status: BetSlipStatus;
  picks: BetPick[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface CreateBetSlipInput {
  id: Id;
  userId: Id;
  stake: Money;
  picks: BetPick[];
  createdAt?: Date;
}

export default class BetSlip extends Entity {
  constructor(private readonly props: BetSlipProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this.validateInvariants();
  }

  public static create(input: CreateBetSlipInput): BetSlip {
    if (input.picks.length === 0) {
      throw new Error('BetSlip must have at least one pick');
    }
    const totalOdd = BetSlip.calculateTotalOdd(input.picks);
    const possibleWin = BetSlip.calculatePossibleWin(input.stake, totalOdd);
    return new BetSlip({
      id: input.id,
      userId: input.userId,
      stake: input.stake,
      totalOdd,
      possibleWin,
      status: BetSlipStatus.PENDING,
      picks: [...input.picks],
      createdAt: input.createdAt ?? new Date(),
      updatedAt: new Date(),
    });
  }

  public userId(): Id {
    return this.props.userId;
  }

  public stake(): Money {
    return this.props.stake;
  }

  public belongsTome(userId: Id) {
    return this.userId().equals(userId);
  }
  public totalOdd(): number {
    return this.props.totalOdd;
  }

  public possibleWin(): Money {
    return this.props.possibleWin;
  }

  public status(): BetSlipStatus {
    return this.props.status;
  }

  public picks(): BetPick[] {
    return [...this.props.picks];
  }

  public resolvedAt(): Date | undefined {
    return this.props.resolvedAt;
  }

  public isPending(): boolean {
    return this.props.status === BetSlipStatus.PENDING;
  }

  public isResolved(): boolean {
    return this.props.status !== BetSlipStatus.PENDING;
  }

  public isWon(): boolean {
    return this.props.status === BetSlipStatus.WON;
  }

  public isLost(): boolean {
    return this.props.status === BetSlipStatus.LOST;
  }

  public isCanceled(): boolean {
    return this.props.status === BetSlipStatus.CANCELED;
  }

  public addPick(pick: BetPick): void {
    this.assertPending('add pick');
    const hasSameMatch = this.props.picks.some((existingPick) =>
      existingPick.getMatchId().equals(pick.getMatchId()),
    );
    if (hasSameMatch) {
      throw new Error('A pick for this match already exists');
    }
    this.props.picks.push(pick);
    this.recalculate();
    this.touch();
  }

  public hasPickForMatch(matchId: Id): boolean {
    return this.props.picks.some((pick) => pick.getMatchId().equals(matchId));
  }

  public PickCount(): number {
    return this.props.picks.length;
  }

  public settle(): void {
    this.assertPending('settle');

    if (this.props.picks.some((pick) => pick.isPending())) {
      throw new Error('Cannot settle BetSlip with pending picks');
    }

    const allWon = this.props.picks.every((pick) => pick.isWon());

    if (allWon) {
      this.markAsWon();
      return;
    }

    this.markAsLost();
  }

  public markAsWon(): void {
    this.assertPending('mark as won');
    this.props.status = BetSlipStatus.WON;
    this.props.resolvedAt = new Date();
    this.touch();
  }

  public markAsLost(): void {
    this.assertPending('mark as lost');
    this.props.status = BetSlipStatus.LOST;
    this.props.resolvedAt = new Date();
    this.touch();
  }

  public cancel(): void {
    this.assertPending('cancel');
    this.props.status = BetSlipStatus.CANCELED;
    this.props.resolvedAt = new Date();
    this.touch();
  }

  public canCancel(): boolean {
    return this.isPending();
  }

  public recalculate(): void {
    this.props.totalOdd = BetSlip.calculateTotalOdd(this.props.picks);
    this.props.possibleWin = BetSlip.calculatePossibleWin(
      this.props.stake,
      this.props.totalOdd,
    );

    this.touch();
  }

  private static calculateTotalOdd(picks: BetPick[]): number {
    if (picks.length === 0) {
      throw new Error('Cannot calculate odd without picks');
    }
    return picks.reduce((total, pick) => total * pick.getOddValue(), 1);
  }

  private static calculatePossibleWin(stake: Money, totalOdd: number): Money {
    const betAmount = stake.getValue();
    return new Money(Math.floor(betAmount / 1000) * 30_000);
  }

  private validateInvariants(): void {
    if (this.props.picks.length === 0) {
      throw new Error('BetSlip must have at least one pick');
    }

    if (this.props.stake.isZero() || this.props.stake.isNegative()) {
      throw new Error('BetSlip stake must be greater than zero');
    }

    if (!Number.isFinite(this.props.totalOdd)) {
      throw new Error('Total odd must be a finite number');
    }

    if (this.props.totalOdd < 1) {
      throw new Error('Total odd must be greater than or equal to 1');
    }

    if (this.props.possibleWin.isNegative()) {
      throw new Error('Possible win cannot be negative');
    }

    if (this.props.status !== BetSlipStatus.PENDING && !this.props.resolvedAt) {
      throw new Error('Resolved BetSlip must have resolvedAt');
    }

    if (this.props.status === BetSlipStatus.PENDING && this.props.resolvedAt) {
      throw new Error('Pending BetSlip cannot have resolvedAt');
    }

    this.validateDuplicateMatches();
  }

  private validateDuplicateMatches(): void {
    const matchIds = this.props.picks.map((pick) =>
      pick.getMatchId().getValue(),
    );

    const uniqueMatchIds = new Set(matchIds);

    if (matchIds.length !== uniqueMatchIds.size) {
      throw new Error(
        'BetSlip cannot contain multiple picks for the same match',
      );
    }
  }

  private assertPending(action: string): void {
    if (!this.isPending) {
      throw new Error(`Cannot ${action} on a ${this.props.status} BetSlip`);
    }
  }

  // ============================================================
  // Persistence
  // ============================================================

  public toProps(): BetSlipProps {
    return {
      ...this.props,
      picks: [...this.props.picks],
    };
  }
}
