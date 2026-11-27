import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import Id from '@/shared/entities/Id';
import type LedgerRepository from '../../domain/repositories/LedgerRepository';

@Injectable()
export default class GetLedgerEntryUseCase {
  constructor(
    @Inject('LedgerRepository')
    private readonly ledgerRepository: LedgerRepository,
  ) {}

  async execute(userId: string, ledgerEntryId: string) {
    const entry = await this.ledgerRepository.findById(new Id(ledgerEntryId));

    if (!entry || entry.userId.getValue() !== userId) {
      throw new NotFoundException('Ledger entry not found');
    }

    return entry.toProps();
  }
}
