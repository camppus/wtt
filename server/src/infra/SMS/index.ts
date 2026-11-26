import { Module } from '@nestjs/common';
import ConsoleSms from './providers/ConsoleSms';
import { SmsHub } from './providers/smshub';
import { PhoneNumber } from '@/modules/users/domain/entities/PhoneNumber';
export interface SMSService {
  send(to: PhoneNumber, message: string): Promise<void>;
}
@Module({
  providers: [
    {
      provide: 'SMSService',
      useExisting: ConsoleSms,
    },
    SmsHub,
    ConsoleSms,
  ],
  exports: ['SMSService'],
})
export default class SMSModule {}
