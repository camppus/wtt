import Id from '@/shared/entities/Id';
import Entity from '@/shared/entities/Entiry';

export enum ProgressionStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
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

  private constructor(props: BettingProgressionProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this.props = props;
    this.validateInvariants();
  }

  public isMaxedSteps() {
    return this.props.currentStep >= 3;
  }

  public getMaxOdds() {
    return 6.0;
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

  public get userId(): Id {
    return this.props.userId;
  }

  public get currentStep(): number {
    return this.props.currentStep;
  }

  public get status(): ProgressionStatus {
    return this.props.status;
  }

  public get startedAt(): Date {
    return this.props.startedAt;
  }

  public get completedAt(): Date | undefined {
    return this.props.completedAt;
  }

  public get failedAt(): Date | undefined {
    return this.props.failedAt;
  }

  public get isActive(): boolean {
    return this.props.status === ProgressionStatus.ACTIVE;
  }

  public get isCompleted(): boolean {
    return this.props.status === ProgressionStatus.COMPLETED;
  }

  public get isFailed(): boolean {
    return this.props.status === ProgressionStatus.FAILED;
  }

  public get isCancelled(): boolean {
    return this.props.status === ProgressionStatus.CANCELLED;
  }

  public advance(): void {
    this.assertActive();

    this.props.currentStep += 1;

    if (this.props.currentStep >= 3) {
      this.complete();
      return;
    }

    this.touch();
  }

  public fail(): void {
    this.assertActive();

    this.props.status = ProgressionStatus.FAILED;
    this.props.failedAt = new Date();

    this.touch();
  }

  public cancel(): void {
    this.assertActive();

    this.props.status = ProgressionStatus.CANCELLED;

    this.touch();
  }

  public reset(): void {
    this.assertActive();

    this.props.currentStep = 0;

    this.touch();
  }

  private complete(): void {
    this.assertActive();

    this.props.status = ProgressionStatus.COMPLETED;
    this.props.completedAt = new Date();

    this.touch();
  }

  private assertActive(): void {
    if (!this.isActive) {
      throw new Error(`Cannot modify a ${this.props.status} progression`);
    }
  }

  private validateInvariants(): void {
    if (this.props.currentStep < 0) {
      throw new Error('Current step cannot be negative');
    }

    if (this.props.status === ProgressionStatus.COMPLETED) {
      if (!this.props.completedAt) {
        throw new Error('Completed progression must have completedAt');
      }
    }

    if (this.props.status === ProgressionStatus.FAILED) {
      if (!this.props.failedAt) {
        throw new Error('Failed progression must have failedAt');
      }
    }

    if (
      this.props.status === ProgressionStatus.ACTIVE &&
      this.props.currentStep >= 3
    ) {
      throw new Error('Active progression cannot have completed steps');
    }
  }

  public toProps(): BettingProgressionProps {
    return {
      ...this.props,
    };
  }
}
