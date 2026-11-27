import { Inject, Injectable } from '@nestjs/common';

import Id from '@/shared/entities/Id';
import { PaginationInput } from '@/shared/types';

import type LedgerRepository from '../../domain/repositories/LedgerRepository';

@Injectable()
export default class ListLedgerEntriesUseCase {
  constructor(
    @Inject('LedgerRepository')
    private readonly ledgerRepository: LedgerRepository,
  ) {}

  async execute(userId: string, options: PaginationInput) {
    const data = await this.ledgerRepository.findByUserId(
      new Id(userId),
      options,
    );
    return {
      ...data,
      data: data.data.map((item) => item.toProps()),
    };
  }
}
