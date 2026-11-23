import { Inject, Injectable } from '@nestjs/common';
import { PaginationInput } from '@/shared/types';
import Id from '@/shared/entities/Id';
import type PaymentRepository from '../../domain/repositories/PaymentRepository';

@Injectable()
export default class GetPaymentUseCases {
  constructor(
    @Inject('PaymentRepository')
    private readonly repo: PaymentRepository,
  ) {}

  public async getAll(dto: {
    pagination: PaginationInput;
    userId: Id;
    isAdmin: boolean;
  }) {
    const { isAdmin, pagination, userId } = dto;
    if (isAdmin) {
      const response = await this.repo.getPayments(pagination);
      return {
        ...response,
        data: response.data.map((item) => {
          item.toEntitie();
        }),
      };
    }
    const response = await this.repo.getPaymentByUserid(pagination, userId);
    return {
      ...response,
      data: response.data.map((item) => {
        item.toEntitie();
      }),
    };
  }

  public async getById(dto: { id: Id; userId: Id; isAdmin: boolean }) {
    const { id, isAdmin, userId } = dto;
    const payment = await this.repo.getByUnique({
      id,
    });

    if (!payment) {
      throw new Error('payment not found');
    }

    if (!isAdmin && !payment.belongsTo(userId)) {
      throw new Error('Access danied');
    }
    return {
      data: payment.toEntitie(),
    };
  }

  public async getByRefernce(reference: string) {
    const payment = await this.repo.getByUnique({
      reference,
    });

    if (!payment) {
      throw new Error('payment not found');
    }

    return payment;
  }
}
