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
    const amount = new Money(input.amount);
    Money.ensureIsPayable(input.amount);
    Money.ensureIsPayable(input.balanceAfter);
    const entry = LedgerEntry.create({
      id: Id.generate(),
      userId: new Id(input.userId),
      type: input.type,
      direction: input.direction,
      amount,
      balanceBefore: new Money(input.balanceBefore),
      balanceAfter: new Money(input.balanceAfter),
      referenceId: input.referenceId ? new Id(input.referenceId) : undefined,
      description: input.description,
    });

    await this.ledgerRepository.save(entry);

    return entry;
  }
}
