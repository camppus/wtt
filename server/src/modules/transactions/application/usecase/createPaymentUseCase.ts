import { Inject, Injectable } from '@nestjs/common';
import type PaymentRepository from '../../domain/repositories/PaymentRepository';
import type { IPaymentGetaway } from '../../infra/getaway';
import CreatePaymentDto from '../dto/createPaymentDto';
import Id from '@/shared/entities/Id';
import Money from '@/shared/entities/Money';
import Payment from '../../domain/entities/Payment';
import { WipayReturnType } from '../../infra/getaway/providers/wipay';
import { Currency } from '../../domain/entities/Currency';
import { PaymentStatus } from '../../domain/entities/PaymentStatus';

@Injectable()
export default class CreatePaymentUseCase {
  constructor(
    @Inject('PaymentRepository')
    private readonly repo: PaymentRepository,
    @Inject('IPaymentGetaway')
    private readonly paymentGetaway: IPaymentGetaway<WipayReturnType>,
  ) {}

  public async handle(dto: CreatePaymentDto, userId: Id) {
    const amount = new Money(dto.amount);
    Money.ensureIsPayable(dto.amount);
    const reference = Payment.generateReference();
    const billing = await this.paymentGetaway.pay({
      reference,
      userid: userId,
      amount,
    });
    const now = new Date();
    const payment = new Payment({
      amount,
      cancelledAt: null,
      createdAt: now,
      currency: Currency.AOA,
      expiresAt: null,
      externalReference: reference,
      failedAt: null,
      fee: Money.zero(),
      id: Id.generate(),
      idempotencyKey: dto.key,
      metadata: billing,
      paidAt: null,
      provider: billing.provider,
      reference,
      status: PaymentStatus.PENDING,
      updatedAt: now,
      userId,
    });

    await this.repo.save(payment);
    return {
      payment: payment.toEntitie(),
      billing,
    };
  }
}
