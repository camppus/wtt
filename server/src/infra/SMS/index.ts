import { PhoneNumber } from '@/shared/entities/PhoneNumber';
import { Module } from '@nestjs/common';
import ConsoleSms from './providers/ConsoleSms';
import { SmsHub } from './providers/smshub';
export abstract class SMSService {
  public abstract send(to: PhoneNumber, message: string): Promise<void>;
}
@Module({
  providers: [
    {
      provide: SMSService,
      useClass: process.env.NODE_ENV === 'production' ? SmsHub : ConsoleSms,
    },
  ],
  exports: [SMSService],
})
export default class SMSModule {}
