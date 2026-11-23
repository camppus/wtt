import { Injectable } from '@nestjs/common';
import { Prisma, Payment as PrismaPayment } from '@prisma/client';

import PrismaService from '@/infra/database/Prisma/prisma.service';
import Id from '@/shared/entities/Id';
import Money from '@/shared/entities/Money';
import { Pagination, PaginationInput } from '@/shared/types';

import Payment, { PayementProps } from '../../domain/entities/Payment';
import PaymentRepository from '../../domain/repositories/PaymentRepository';
import { Currency } from '../../domain/entities/Currency';
import { PaymentStatus } from '../../domain/entities/PaymentStatus';

@Injectable()
export default class PrismaPaymentRepo implements PaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async save(payment: Payment): Promise<void> {
    const data = payment.toEntitie();

    await this.prisma.payment.upsert({
      where: { id: data.id.getValue() },

      create: {
        id: data.id.getValue(),
        userId: data.userId.getValue(),
        amount: data.amount.getValue(),
        fee: data.fee.getValue(),
        reference: data.reference,
        provider: data.provider,
        idempotencyKey: data.idempotencyKey,
        externalReference: data.externalReference,
        currency: data.currency,
        status: data.status,
        metadata: data.metadata as Prisma.InputJsonValue,
        expiresAt: data.expiresAt,
        paidAt: data.paidAt,
        cancelledAt: data.cancelledAt,
        failedAt: data.failedAt,
      },

      update: {
        amount: data.amount.getValue(),
        fee: data.fee.getValue(),
        externalReference: data.externalReference,
        provider: data.provider,
        status: data.status,
        metadata: data.metadata as Prisma.InputJsonValue,
        expiresAt: data.expiresAt,
        paidAt: data.paidAt,
        cancelledAt: data.cancelledAt,
        failedAt: data.failedAt,
      },
    });
  }

  public async getByUnique(uniques: {
    id?: Id;
    reference?: string;
    externalReference?: string;
  }): Promise<Payment | null> {
    const conditions: Prisma.PaymentWhereInput[] = [];

    if (uniques.id) {
      conditions.push({ id: uniques.id.getValue() });
    }

    if (uniques.reference) {
      conditions.push({ reference: uniques.reference });
    }

    if (uniques.externalReference) {
      conditions.push({
        externalReference: uniques.externalReference,
      });
    }

    if (!conditions.length) {
      throw new Error('At least one unique field must be provided');
    }

    const payment = await this.prisma.payment.findFirst({
      where: { OR: conditions },
    });

    return payment ? this.toDomain(payment) : null;
  }

  public async getPayments(
    pagination: PaginationInput,
  ): Promise<Pagination<Payment>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [payments, total] = await this.prisma.$transaction([
      this.prisma.payment.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count(),
    ]);

    return {
      data: payments.map((payment) => this.toDomain(payment)),
      total,
      currentPage: page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  public async getPaymentByUserid(
    pagination: PaginationInput,
    userId: Id,
  ): Promise<Pagination<Payment>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const where: Prisma.PaymentWhereInput = {
      userId: userId.getValue(),
    };

    const [payments, total] = await this.prisma.$transaction([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return {
      data: payments.map((payment) => this.toDomain(payment)),
      total,
      currentPage: page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  private toDomain(data: PrismaPayment): Payment {
    const props: PayementProps = {
      id: new Id(data.id),
      userId: new Id(data.userId),
      amount: new Money(Number(data.amount)),
      fee: new Money(Number(data.fee)),
      reference: data.reference,
      provider: data.provider,
      idempotencyKey: data.idempotencyKey,
      externalReference: data.externalReference,
      currency: data.currency as Currency,
      status: data.status as PaymentStatus,
      metadata: (data.metadata ?? {}) as Record<string, any>,
      expiresAt: data.expiresAt,
      paidAt: data.paidAt,
      cancelledAt: data.cancelledAt,
      failedAt: data.failedAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    return new Payment(props);
  }
}
