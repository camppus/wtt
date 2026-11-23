import { Module } from '@nestjs/common';
import PaymentGetawayModule from '../getaway';
import CreatePaymentUseCase from '../../application/usecase/createPaymentUseCase';
import CreateWidthdrawslsUseCase from '../../application/usecase/createWidthdrawlsUseCase';
import GetPaymentUseCases from '../../application/usecase/getPaymentUseCase';
import GetWidthrawlsUseCase from '../../application/usecase/getWitdhDrawlsUseCase';
import ToggleWidthDrawlsUseCase from '../../application/usecase/toggleWidthdrawlsUseCase';
import UpdatePaymentUseCase from '../../application/usecase/updatePaymenUseCase';
import PrismaPaymentRepo from '../persistence/PrismaPaymentRepo';
import PrismaWidthdrawlRepo from '../persistence/PriamaWidhtdrawlsRepo';

@Module({
  controllers: [],
  exports: ['PaymentRepository', 'WidthDrawlRepo'],
  imports: [PaymentGetawayModule],
  providers: [
    {
      provide: 'PaymentRepository',
      useClass: PrismaPaymentRepo,
    },
    {
      provide: 'WidthDrawlRepo',
      useClass: PrismaWidthdrawlRepo,
    },
    CreatePaymentUseCase,
    CreateWidthdrawslsUseCase,
    GetPaymentUseCases,
    GetWidthrawlsUseCase,
    ToggleWidthDrawlsUseCase,
    UpdatePaymentUseCase,
  ],
})
export default class TransactionModule {}
