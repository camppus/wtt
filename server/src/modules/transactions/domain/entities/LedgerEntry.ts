import Id from '@/shared/entities/Id';
import Money from '@/shared/entities/Money';
import Entity from '@/shared/entities/Entiry';

export enum LedgerEntryType {
  DEPOSIT = 'DEPOSIT',
  BET_STAKE = 'BET_STAKE',
  BET_WIN = 'BET_WIN',
  BET_REFUND = 'BET_REFUND',
  WITHDRAWAL = 'WITHDRAWAL',
  WITHDRAWAL_REFUND = 'WITHDRAWAL_REFUND',
  FEE = 'FEE',
}

export enum LedgerEntryDirection {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export interface LedgerEntryProps {
  id: Id;
  userId: Id;
  type: LedgerEntryType;
  direction: LedgerEntryDirection;
  amount: Money;
  balanceBefore: Money;
  balanceAfter: Money;
  referenceId?: Id;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLedgerEntryInput {
  id: Id;
  userId: Id;
  type: LedgerEntryType;
  direction: LedgerEntryDirection;
  amount: Money;
  balanceBefore: Money;
  balanceAfter: Money;
  referenceId?: Id;
  description?: string;
  createdAt?: Date;
}

export default class LedgerEntry extends Entity {
  private props: LedgerEntryProps;

  constructor(props: LedgerEntryProps) {
    super(props.id, props.createdAt, props.updatedAt);

    this.props = props;

    this.validateInvariants();
  }

  public static create(input: CreateLedgerEntryInput): LedgerEntry {
    const now = input.createdAt ?? new Date();

    return new LedgerEntry({
      ...input,
      createdAt: now,
      updatedAt: now,
    });
  }

  public static restore(props: LedgerEntryProps): LedgerEntry {
    return new LedgerEntry(props);
  }

  public get userId(): Id {
    return this.props.userId;
  }

  public get type(): LedgerEntryType {
    return this.props.type;
  }

  public get direction(): LedgerEntryDirection {
    return this.props.direction;
  }

  public get amount(): Money {
    return this.props.amount;
  }

  public get balanceBefore(): Money {
    return this.props.balanceBefore;
  }

  public get balanceAfter(): Money {
    return this.props.balanceAfter;
  }

  public get referenceId(): Id | undefined {
    return this.props.referenceId;
  }

  public get description(): string | undefined {
    return this.props.description;
  }

  private validateInvariants(): void {
    if (this.props.amount.isZero() || this.props.amount.isNegative()) {
      throw new Error('Ledger amount must be greater than zero');
    }
  }

  public toProps(): LedgerEntryProps {
    return {
      ...this.props,
    };
  }
}
