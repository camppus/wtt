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
  resolvedAt?: Date;
  updatedAt: Date;
}

export interface CreateBetSlipInput {
  id: Id;
  userId: Id;
  stake: Money;
  picks: BetPick[];
  createdAt?: Date;
}

export default class BetSlip extends Entity {
  constructor(private props: BetSlipProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this.validateInvariants();
  }

  public static create(input: CreateBetSlipInput): BetSlip {
    if (!input.picks || input.picks.length === 0) {
      throw new Error('BetSlip must have at least one pick');
    }

    const now = input.createdAt ?? new Date();
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
      createdAt: now,
      updatedAt: now,
    });
  }

  public get userId(): Id {
    return this.props.userId;
  }
  public get stake(): Money {
    return this.props.stake;
  }
  public get totalOdd(): number {
    return this.props.totalOdd;
  }
  public get possibleWin(): Money {
    return this.props.possibleWin;
  }
  public getStatus(): BetSlipStatus {
    return this.props.status;
  }
  public get picks(): BetPick[] {
    return [...this.props.picks];
  }
  public get resolvedAt(): Date | undefined {
    return this.props.resolvedAt;
  }
  public get isPending(): boolean {
    return this.props.status === BetSlipStatus.PENDING;
  }
  public get isResolved(): boolean {
    return this.props.status !== BetSlipStatus.PENDING;
  }
  public get isWon(): boolean {
    return this.props.status === BetSlipStatus.WON;
  }
  public get isLost(): boolean {
    return this.props.status === BetSlipStatus.LOST;
  }
  public get isCanceled(): boolean {
    return this.props.status === BetSlipStatus.CANCELED;
  }

  public addPick(pick: BetPick): void {
    this.assertPending('add pick');

    const alreadyExists = this.props.picks.some((p) =>
      p.getId().equals(pick.getId()),
    );
    if (alreadyExists) {
      throw new Error('Pick already exists in this BetSlip');
    }

    const hasConflict = this.props.picks.some((p) => p.conflictsWith(pick));
    if (hasConflict) {
      throw new Error('Conflicting pick for same event/market');
    }

    this.props.picks.push(pick);
    this.recalculate();
    this.touch();
  }

  public removePick(pickId: Id): void {
    this.assertPending('remove pick');

    const before = this.props.picks.length;
    this.props.picks = this.props.picks.filter(
      (p) => !p.getId().equals(pickId),
    );

    if (this.props.picks.length === before) {
      throw new Error('Pick not found in BetSlip');
    }
    if (this.props.picks.length === 0) {
      throw new Error('BetSlip cannot be left without picks');
    }

    this.recalculate();
    this.touch();
  }

  public settle(): void {
    this.assertPending('settle');

    if (this.props.picks.some((p) => p.isPending())) {
      throw new Error('Cannot settle BetSlip with pending picks');
    }

    if (this.props.picks.every((p) => p.isWon())) {
      this.markAsWon();
    } else {
      this.markAsLost();
    }
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
    return this.isPending;
  }

  public recalculate(): void {
    this.props.totalOdd = BetSlip.calculateTotalOdd(this.props.picks);
    this.props.possibleWin = BetSlip.calculatePossibleWin(
      this.props.stake,
      this.props.totalOdd,
    );
  }

  private static calculateTotalOdd(picks: BetPick[]): number {
    return picks.reduce((acc, pick) => acc * pick.getOddValue(), 1);
  }

  private static calculatePossibleWin(stake: Money, totalOdd: number): Money {
    // calc possiblewin per game
    return stake;
  }

  private validateInvariants(): void {
    if (this.props.picks.length === 0) {
      throw new Error('BetSlip must have at least one pick');
    }
    if (this.props.totalOdd < 1) {
      throw new Error('Total odd must be >= 1');
    }
    if (this.isResolved && !this.props.resolvedAt) {
      throw new Error('Resolved BetSlip must have resolvedAt');
    }
  }

  private assertPending(action: string): void {
    if (!this.isPending) {
      throw new Error(`Cannot ${action} on a ${this.props.status} BetSlip`);
    }
  }

  public toProps(): BetSlipProps {
    return {
      ...this.props,
      picks: [...this.props.picks],
    };
  }
}
