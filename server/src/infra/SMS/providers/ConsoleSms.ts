/* eslint-disable @typescript-eslint/require-await */
import { Logger } from '@nestjs/common';
import { SMSService } from '..';
import { PhoneNumber } from '@/shared/entities/PhoneNumber';

export default class ConsoleSms extends SMSService {
  private readonly logger = new Logger(ConsoleSms.name);

  public async send(to: PhoneNumber, message: string): Promise<void> {
    this.logger.log('========== SMS ==========');
    this.logger.log(`Destinatário: ${to.getValue()}`);
    this.logger.log(`Mensagem: ${message}`);
    this.logger.log('=========================');
  }
}
