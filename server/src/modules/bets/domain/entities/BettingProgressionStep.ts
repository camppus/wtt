import Id from '@/shared/entities/Id';
import Money from '@/shared/entities/Money';
import Entity from '@/shared/entities/Entiry';

export enum ProgressionStepStatus {
  PENDING = 'PENDING',
  WON = 'WON',
  LOST = 'LOST',
  VOID = 'VOID',
}

export interface BettingProgressionStepProps {
  id: Id;
  progressionId: Id;
  stepNumber: number;
  status: ProgressionStepStatus;
  betId?: Id;
  stakeAmount: Money;
  payoutAmount: Money;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBettingProgressionStepInput {
  id: Id;
  progressionId: Id;
  stepNumber: number;
  stakeAmount: Money;
  betId?: Id;
}

export default class BettingProgressionStep extends Entity {
  private props: BettingProgressionStepProps;

  private constructor(props: BettingProgressionStepProps) {
    super(props.id, props.createdAt, props.updatedAt);

    this.props = props;

    this.validateInvariants();
  }

  public static create(
    input: CreateBettingProgressionStepInput,
  ): BettingProgressionStep {
    const now = new Date();

    return new BettingProgressionStep({
      id: input.id,
      progressionId: input.progressionId,
      stepNumber: input.stepNumber,
      status: ProgressionStepStatus.PENDING,
      betId: input.betId,
      stakeAmount: input.stakeAmount,
      payoutAmount: Money.zero(),
      createdAt: now,
      updatedAt: now,
    });
  }

  public get progressionId(): Id {
    return this.props.progressionId;
  }

  public get stepNumber(): number {
    return this.props.stepNumber;
  }

  public get status(): ProgressionStepStatus {
    return this.props.status;
  }

  public get betId(): Id | undefined {
    return this.props.betId;
  }

  public get stakeAmount(): Money {
    return this.props.stakeAmount;
  }

  public get payoutAmount(): Money {
    return this.props.payoutAmount;
  }

  public get completedAt(): Date | undefined {
    return this.props.completedAt;
  }

  public get isPending(): boolean {
    return this.props.status === ProgressionStepStatus.PENDING;
  }

  public get isWon(): boolean {
    return this.props.status === ProgressionStepStatus.WON;
  }

  public get isLost(): boolean {
    return this.props.status === ProgressionStepStatus.LOST;
  }

  public get isVoid(): boolean {
    return this.props.status === ProgressionStepStatus.VOID;
  }

  public markAsWon(payout: Money): void {
    this.assertPending();

    this.props.status = ProgressionStepStatus.WON;
    this.props.payoutAmount = payout;
    this.props.completedAt = new Date();

    this.touch();
  }

  public markAsLost(): void {
    this.assertPending();

    this.props.status = ProgressionStepStatus.LOST;
    this.props.payoutAmount = Money.zero();
    this.props.completedAt = new Date();

    this.touch();
  }

  public void(): void {
    this.assertPending();

    this.props.status = ProgressionStepStatus.VOID;
    this.props.payoutAmount = Money.zero();
    this.props.completedAt = new Date();

    this.touch();
  }

  private assertPending(): void {
    if (!this.isPending) {
      throw new Error(`Cannot modify a ${this.props.status} progression step`);
    }
  }

  private validateInvariants(): void {
    if (this.props.stepNumber < 1) {
      throw new Error('Step number must start at 1');
    }

    if (
      this.props.stakeAmount.isZero() ||
      this.props.stakeAmount.isNegative()
    ) {
      throw new Error('Step stake must be greater than zero');
    }

    if (this.props.status === ProgressionStepStatus.WON) {
      if (!this.props.completedAt) {
        throw new Error('Won step must have completedAt');
      }
    }

    if (this.props.status === ProgressionStepStatus.LOST) {
      if (!this.props.completedAt) {
        throw new Error('Lost step must have completedAt');
      }
    }

    if (this.props.status === ProgressionStepStatus.VOID) {
      if (!this.props.completedAt) {
        throw new Error('Void step must have completedAt');
      }
    }
  }

  public toProps(): BettingProgressionStepProps {
    return {
      ...this.props,
    };
  }
}
