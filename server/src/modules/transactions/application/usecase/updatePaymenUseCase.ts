import { Inject, Injectable } from '@nestjs/common';
import type PaymentRepository from '../../domain/repositories/PaymentRepository';
import GetPaymentUseCases from './getPaymentUseCase';
import GetUserByIdUseCase from '@/modules/users/application/usecases/getUserByIdUseCase';
import type UserRepo from '@/modules/users/domain/repositories/UserRepo';
import Money from '@/shared/entities/Money';

@Injectable()
export default class UpdatePaymentUseCase {
  constructor(
    @Inject('PaymentRepository')
    private readonly repo: PaymentRepository,
    private readonly getPaymentUC: GetPaymentUseCases,
    private readonly getUserUc: GetUserByIdUseCase,
    @Inject('UserRepo')
    private readonly userRepo: UserRepo,
  ) {}

  public async handle(dto: { reference: string; paid: boolean }) {
    const { paid, reference } = dto;
    const payment = await this.getPaymentUC.getByRefernce(reference);
    const user = await this.getUserUc.getEntitie(payment.getUserId());
    if (paid) {
      payment.approve();
      const balance = new Money(
        user.getbalance().getValue() + payment.toEntitie().amount.getValue(),
      );
      user.changeBalance(balance);
      await this.userRepo.save(user);
    } else {
      payment.cancel();
    }
    await this.repo.save(payment);
    return {
      sucess: true,
    };
  }
}
