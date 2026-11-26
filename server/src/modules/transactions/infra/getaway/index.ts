import Id from '@/shared/entities/Id';
import Money from '@/shared/entities/Money';
import { Global, Module } from '@nestjs/common';
import WipayService from './providers/wipay';

export interface IPaymentGetaway<T> {
  pay(input: { amount: Money; userid: Id; reference: string }): Promise<T>;
}

@Global()
@Module({
  providers: [
    {
      provide: 'IPaymentGetaway',
      useClass: WipayService,
    },
  ],
  exports: ['IPaymentGetaway'],
})
export default class PaymentGetawayModule {}
