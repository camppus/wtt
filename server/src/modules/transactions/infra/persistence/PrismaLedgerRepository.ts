import { Injectable } from '@nestjs/common';
import {
  LedgerEntry as PrismaLedgerEntry,
  LedgerEntryDirection as PrismaLedgerEntryDirection,
  LedgerEntryType as PrismaLedgerEntryType,
} from '@prisma/client';

import PrismaService from '@/infra/database/Prisma/prisma.service';
import { Pagination, PaginationInput } from '@/shared/types';
import { getPagination } from '@/shared/lib';
import Id from '@/shared/entities/Id';

import LedgerEntry, {
  LedgerEntryProps,
  LedgerEntryDirection,
  LedgerEntryType,
} from '../../domain/entities/LedgerEntry';

import LedgerRepository from '../../domain/repositories/LedgerRepository';
import Money from '@/shared/entities/Money';

@Injectable()
export default class PrismaLedgerRepository implements LedgerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: Id): Promise<LedgerEntry | null> {
    const entry = await this.prisma.ledgerEntry.findFirst({
      where: {
        id: id.getValue(),
      },
    });

    if (!entry) {
      return null;
    }

    return LedgerEntry.restore(this.toDomain(entry));
  }

  async findByUserId(
    userId: Id,
    options: PaginationInput,
  ): Promise<Pagination<LedgerEntry>> {
    const { limit, page, skip } = getPagination(options);

    const where = {
      userId: userId.getValue(),
    };

    const [total, entries] = await Promise.all([
      this.prisma.ledgerEntry.count({
        where,
      }),

      this.prisma.ledgerEntry.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip,
      }),
    ]);

    return {
      currentPage: page,
      lastPage: Math.ceil(total / limit),
      data: entries.map((entry) => LedgerEntry.restore(this.toDomain(entry))),
      limit,
      total,
    };
  }

  async findByReferenceId(referenceId: Id): Promise<LedgerEntry | null> {
    const entry = await this.prisma.ledgerEntry.findFirst({
      where: {
        referenceId: referenceId.getValue(),
      },
    });

    if (!entry) {
      return null;
    }

    return LedgerEntry.restore(this.toDomain(entry));
  }

  async save(entry: LedgerEntry): Promise<void> {
    const data = entry.toProps();

    await this.prisma.ledgerEntry.create({
      data: {
        id: data.id.getValue(),
        userId: data.userId.getValue(),
        type: data.type as PrismaLedgerEntryType,
        direction: data.direction as PrismaLedgerEntryDirection,
        amount: data.amount.getValue(),
        balanceBefore: data.balanceBefore.getValue(),
        balanceAfter: data.balanceAfter.getValue(),
        referenceId: data.referenceId?.getValue(),
        description: data.description,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  private toDomain(entry: PrismaLedgerEntry): LedgerEntryProps {
    return {
      id: new Id(entry.id),
      userId: new Id(entry.userId),
      type: entry.type as LedgerEntryType,
      direction: entry.direction as LedgerEntryDirection,
      amount: new Money(entry.amount.toNumber()),
      balanceBefore: new Money(entry.balanceBefore.toNumber()),
      balanceAfter: new Money(entry.balanceAfter.toNumber()),
      referenceId: entry.referenceId ? new Id(entry.referenceId) : undefined,
      description: entry.description ?? undefined,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    };
  }
}
