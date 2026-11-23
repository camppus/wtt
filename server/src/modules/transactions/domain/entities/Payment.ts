import Entity from '@/shared/entities/Entiry';
import Id from '@/shared/entities/Id';
import Money from '@/shared/entities/Money';
import { Currency } from './Currency';
import { PaymentStatus } from './PaymentStatus';

export interface PayementProps {
  id: Id;
  amount: Money;
  fee: Money;
  userId: Id;
  reference: string;
  provider: string;
  idempotencyKey: string;
  externalReference: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date | null;
  paidAt: Date | null;
  cancelledAt: Date | null;
  failedAt: Date | null;
  currency: Currency;
  status: PaymentStatus;
  metadata: Record<string, any>;
}

export default class Payment extends Entity {
  constructor(private readonly props: PayementProps) {
    super(props.id, props.createdAt, props.updatedAt);
  }

  public getUserId() {
    return this.props.userId;
  }
  public expire() {
    if (this.props.status !== PaymentStatus.PENDING) {
      throw new Error('Only pending payment can be expired');
    }
    this.props.status = PaymentStatus.EXPIRED;
    this.props.expiresAt = new Date();
    this.touch();
  }

  public approve() {
    if (this.props.status !== PaymentStatus.PENDING) {
      throw new Error('Only pending payment can be approved');
    }
    this.props.status = PaymentStatus.PAID;
    this.props.paidAt = new Date();
    this.touch();
  }

  public cancel() {
    if (this.props.status !== PaymentStatus.PENDING) {
      throw new Error('Only pending payment can be cancelled');
    }
    this.props.status = PaymentStatus.CANCELLED;
    this.props.cancelledAt = new Date();
    this.touch();
  }

  public toEntitie(): PayementProps {
    return this.props;
  }

  static generateReference() {
    return `WTT-PAYMENT-REF-${crypto.randomUUID()}`;
  }
  public belongsTo(userId: Id) {
    return this.props.userId.getValue() === userId.getValue();
  }
}
