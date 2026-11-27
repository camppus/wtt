import { Inject, Injectable } from '@nestjs/common';
import Id from '@/shared/entities/Id';
import Money from '@/shared/entities/Money';
import LedgerEntry, {
  LedgerEntryDirection,
  LedgerEntryType,
} from '../../domain/entities/LedgerEntry';

import type LedgerRepository from '../../domain/repositories/LedgerRepository';

export interface CreateLedgerEntryInputDTO {
  userId: string;
  type: LedgerEntryType;
  direction: LedgerEntryDirection;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  referenceId?: string;
  description?: string;
}

@Injectable()
export default class CreateLedgerEntryUseCase {
  constructor(
    @Inject('LedgerRepository')
    private readonly ledgerRepository: LedgerRepository,
  ) {}

  async execute(input: CreateLedgerEntryInputDTO): Promise<LedgerEntry> {
    const entry = LedgerEntry.create({
      id: Id.generate(),
      userId: new Id(input.userId),
      type: input.type,
      direction: input.direction,
      amount: new Money(input.amount, true),
      balanceBefore: new Money(input.balanceBefore, true),
      balanceAfter: new Money(input.balanceAfter, true),
      referenceId: input.referenceId ? new Id(input.referenceId) : undefined,
      description: input.description,
    });

    await this.ledgerRepository.save(entry);

    return entry;
  }
}
