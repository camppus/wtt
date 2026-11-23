/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { Prisma, Widthdrawls as PrismaWidthdrawls } from '@prisma/client';

import PrismaService from '@/infra/database/Prisma/prisma.service';
import Id from '@/shared/entities/Id';
import Money from '@/shared/entities/Money';
import Url from '@/shared/entities/Url';
import { Pagination, PaginationInput } from '@/shared/types';

import Widthdrawsl, { WidthdrawlsProps } from '../../domain/entities/Widthdraw';
import { TransactionStatus } from '../../domain/entities/TransactionStatus';
import { TransationsMehtod } from '../../domain/entities/TransationsMehtod';
import WidthDrawlRepo from '../../domain/repositories/WidthdrawalRepo';

@Injectable()
export default class PrismaWidthdrawlRepo implements WidthDrawlRepo {
  constructor(private readonly prisma: PrismaService) {}

  public async save(widthdrawl: Widthdrawsl): Promise<void> {
    const data = widthdrawl.toEntitie();
    await this.prisma.widthdrawls.upsert({
      where: { id: data.id.getValue() },
      create: {
        id: data.id.getValue(),
        userId: data.userId.getValue(),
        status: data.status,
        fee: data.fee.getValue(),
        amount: data.amount.getValue(),
        coordnate: data.coordnate,
        method: data.method,
        replayedById: data.replayedById?.getValue(),
        fileUrl: data.fileUrl?.getValue(),
        notes: data.notes,
        paidAt: data.paidAt,
        cancelledAt: data.cancelledAt,
      },

      update: {
        status: data.status,
        fee: data.fee.getValue(),
        amount: data.amount.getValue(),
        coordnate: data.coordnate,
        method: data.method,
        replayedById: data.replayedById?.getValue(),
        fileUrl: data.fileUrl?.getValue(),
        notes: data.notes,
        paidAt: data.paidAt,
        cancelledAt: data.cancelledAt,
      },
    });
  }

  public async getById(id: Id): Promise<Widthdrawsl | null> {
    const widthdrawl = await this.prisma.widthdrawls.findFirst({
      where: { id: id.getValue() },
    });

    return widthdrawl ? this.toDomain(widthdrawl) : null;
  }

  public async getWidhdrawsls(
    pagination: PaginationInput,
  ): Promise<Pagination<Widthdrawsl>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [widthdrawls, total] = await this.prisma.$transaction([
      this.prisma.widthdrawls.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.widthdrawls.count(),
    ]);

    return {
      data: widthdrawls.map((item) => this.toDomain(item)),
      total,
      currentPage: page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  public async getWidhdrawslsByUserid(
    pagination: PaginationInput,
    userId: Id,
  ): Promise<Pagination<Widthdrawsl>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const where: Prisma.WidthdrawlsWhereInput = {
      userId: userId.getValue(),
    };

    const [widthdrawls, total] = await this.prisma.$transaction([
      this.prisma.widthdrawls.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.widthdrawls.count({ where }),
    ]);

    return {
      data: widthdrawls.map((item) => this.toDomain(item)),
      total,
      currentPage: page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  private toDomain(data: PrismaWidthdrawls): Widthdrawsl {
    const props: WidthdrawlsProps = {
      id: new Id(data.id),
      userId: new Id(data.userId),
      status: data.status as TransactionStatus,
      fee: new Money(Number(data.fee)),
      amount: new Money(Number(data.amount)),
      coordnate: data.coordnate,
      method: data.method as TransationsMehtod,
      replayedById: data.replayedById ? new Id(data.replayedById) : undefined,
      fileUrl: data.fileUrl ? new Url(data.fileUrl) : undefined,
      notes: data.notes ?? undefined,
      paidAt: data.paidAt ?? undefined,
      cancelledAt: data.cancelledAt ?? undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    return new Widthdrawsl(props);
  }
}
