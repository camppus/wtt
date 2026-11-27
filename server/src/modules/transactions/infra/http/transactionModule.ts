import { Module } from '@nestjs/common';
import PaymentGetawayModule from '../getaway';
import UserModule from '@/modules/users/infra/http/userModule';
import CreatePaymentUseCase from '../../application/usecase/createPaymentUseCase';
import CreateWidthdrawslsUseCase from '../../application/usecase/createWidthdrawlsUseCase';
import GetPaymentUseCases from '../../application/usecase/getPaymentUseCase';
import GetWidthrawlsUseCase from '../../application/usecase/getWitdhDrawlsUseCase';
import ToggleWidthDrawlsUseCase from '../../application/usecase/toggleWidthdrawlsUseCase';
import UpdatePaymentUseCase from '../../application/usecase/updatePaymenUseCase';
import CreateLedgerEntryUseCase from '../../application/usecase/CreateLedgerEntry';
import GetLedgerEntryUseCase from '../../application/usecase/GetLedgerEntryUseCase';
import ListLedgerEntriesUseCase from '../../application/usecase/ListLedgerEntriesUseCase';
import PrismaPaymentRepo from '../persistence/PrismaPaymentRepo';
import PrismaWidthdrawlRepo from '../persistence/PriamaWidhtdrawlsRepo';
import PrismaLedgerRepository from '../persistence/PrismaLedgerRepository';
import TransactionController from './transationController';

@Module({
  controllers: [TransactionController],

  imports: [PaymentGetawayModule, UserModule],

  providers: [
    {
      provide: 'PaymentRepository',
      useClass: PrismaPaymentRepo,
    },
    {
      provide: 'WidthDrawlRepo',
      useClass: PrismaWidthdrawlRepo,
    },
    {
      provide: 'LedgerRepository',
      useClass: PrismaLedgerRepository,
    },

    CreatePaymentUseCase,
    CreateWidthdrawslsUseCase,
    GetPaymentUseCases,
    GetWidthrawlsUseCase,
    ToggleWidthDrawlsUseCase,
    UpdatePaymentUseCase,
    CreateLedgerEntryUseCase,
    GetLedgerEntryUseCase,
    ListLedgerEntriesUseCase,
  ],

  exports: ['PaymentRepository', 'WidthDrawlRepo', CreateLedgerEntryUseCase],
})
export default class TransactionModule {}
