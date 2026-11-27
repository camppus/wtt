import { Inject, Injectable } from '@nestjs/common';
import Id from '@/shared/entities/Id';
import Money from '@/shared/entities/Money';
import CreateWidthDralwsDto from '../dto/createWidthdrawlsUseCase';
import type WidthDrawlRepo from '../../domain/repositories/WidthdrawalRepo';
import Widthdrawsl from '../../domain/entities/Widthdraw';
import { TransactionStatus } from '../../domain/entities/TransactionStatus';
import GetUserByIdUseCase from '@/modules/users/application/usecases/getUserByIdUseCase';

@Injectable()
export default class CreateWidthdrawslsUseCase {
  constructor(
    @Inject('WidthDrawlRepo')
    private readonly repo: WidthDrawlRepo,
    private readonly getUserByIdUc: GetUserByIdUseCase,
  ) {}

  public async handle(dto: CreateWidthDralwsDto, userId: Id) {
    const amount = new Money(dto.amount);
    Money.ensureIsPayable(dto.amount);
    const { coordnate, method } = dto;
    const user = await this.getUserByIdUc.getEntitie(userId);
    if (user.hasSuficientBalance(amount)) {
      throw new Error('Insuficient eranings');
    }
    const now = new Date();
    const widthdrawls = new Widthdrawsl({
      amount,
      createdAt: now,
      fee: Money.zero(),
      id: Id.generate(),
      updatedAt: now,
      userId,
      coordnate,
      method,
      status: TransactionStatus.PENDING,
      cancelledAt: undefined,
      fileUrl: undefined,
      notes: undefined,
      paidAt: undefined,
      replayedById: undefined,
    });

    await this.repo.save(widthdrawls);
    return {
      data: widthdrawls.toEntitie(),
    };
  }
}
