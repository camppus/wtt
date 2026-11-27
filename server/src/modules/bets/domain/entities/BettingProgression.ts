import Id from '@/shared/entities/Id';
import Entity from '@/shared/entities/Entiry';

export enum ProgressionStatus {
  ACTIVE = 'ACTIVE',
  LOOPING = 'LOOPING',
  FAILED = 'FAILED',
}

export interface BettingProgressionProps {
  id: Id;
  userId: Id;
  currentStep: number;
  status: ProgressionStatus;
  startedAt: Date;
  completedAt?: Date;
  failedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBettingProgressionInput {
  id: Id;
  userId: Id;
  startedAt?: Date;
}

export default class BettingProgression extends Entity {
  private props: BettingProgressionProps;

  constructor(props: BettingProgressionProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this.props = props;
    this.validateInvariants();
  }

  public static create(
    input: CreateBettingProgressionInput,
  ): BettingProgression {
    const now = new Date();

    return new BettingProgression({
      id: input.id,
      userId: input.userId,
      currentStep: 0,
      status: ProgressionStatus.ACTIVE,
      startedAt: input.startedAt ?? now,
      createdAt: now,
      updatedAt: now,
    });
  }

  public userId(): Id {
    return this.props.userId;
  }

  public getNextStep() {
    return this.currentStep() + 1;
  }
  public getMaxOdds() {
    return 6.0;
  }
  public currentStep(): number {
    return this.props.currentStep;
  }

  public status(): ProgressionStatus {
    return this.props.status;
  }

  public startedAt(): Date {
    return this.props.startedAt;
  }

  public completedAt(): Date | undefined {
    return this.props.completedAt;
  }

  public failedAt(): Date | undefined {
    return this.props.failedAt;
  }

  public isActive(): boolean {
    return this.props.status === ProgressionStatus.ACTIVE;
  }

  public isInLooping(): boolean {
    return this.props.status === ProgressionStatus.LOOPING;
  }

  public isFailed(): boolean {
    return this.props.status === ProgressionStatus.FAILED;
  }

  public advance(): void {
    if (this.isInLooping()) {
      this.touch();
      return;
    }
    this.assertActive();
    this.props.currentStep += 1;
    if (this.props.currentStep === 3) {
      this.enterLooping();
      return;
    }
    this.touch();
  }

  public reset(): void {
    if (
      this.props.status !== ProgressionStatus.ACTIVE &&
      this.props.status !== ProgressionStatus.LOOPING
    ) {
      throw new Error(`Cannot reset a ${this.props.status} progression`);
    }

    this.props.currentStep = 0;
    this.props.status = ProgressionStatus.ACTIVE;
    this.props.completedAt = undefined;

    this.touch();
  }

  public fail(): void {
    this.assertActiveOrLooping();

    this.props.status = ProgressionStatus.FAILED;
    this.props.failedAt = new Date();

    this.touch();
  }

  private enterLooping(): void {
    this.props.status = ProgressionStatus.LOOPING;
    this.touch();
  }

  private assertActive(): void {
    if (!this.isActive) {
      throw new Error(`Cannot modify a ${this.props.status} progression`);
    }
  }

  private assertActiveOrLooping(): void {
    if (!this.isActive && !this.isInLooping) {
      throw new Error(`Cannot modify a ${this.props.status} progression`);
    }
  }

  private validateInvariants(): void {
    if (this.props.currentStep < 0) {
      throw new Error('Current step cannot be negative');
    }

    if (this.props.currentStep > 2) {
      throw new Error('Current step cannot be greater than 2');
    }

    if (
      this.props.status === ProgressionStatus.LOOPING &&
      this.props.currentStep !== 2
    ) {
      throw new Error('Looping progression must be at step 2');
    }

    if (
      this.props.status === ProgressionStatus.ACTIVE &&
      this.props.currentStep >= 2
    ) {
      throw new Error('Active progression cannot be at the looping step');
    }

    if (this.props.status === ProgressionStatus.FAILED) {
      if (!this.props.failedAt) {
        throw new Error('Failed progression must have failedAt');
      }
    }

    if (this.props.status !== ProgressionStatus.FAILED && this.props.failedAt) {
      throw new Error('Only failed progression can have failedAt');
    }
  }

  public toProps(): BettingProgressionProps {
    return {
      ...this.props,
    };
  }
}
