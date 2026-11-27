/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import {
  Prisma,
  BettingProgression as PrismaBettingProgression,
  BettingProgressionStep as PrismaBettingProgressionStep,
} from '@prisma/client';
import Id from '@/shared/entities/Id';
import Money from '@/shared/entities/Money';
import { Pagination, PaginationInput } from '@/shared/types';

import BettingProgression from '../../domain/entities/BettingProgression';
import BettingProgressionStep from '../../domain/entities/BettingProgressionStep';

import type BettingProgressionRepository from '../../domain/repositories/BettingProgressionRepository';
import PrimaService from '@/infra/database/Prisma/prisma.service';

@Injectable()
export default class PrismaBettingProgressionRepository implements BettingProgressionRepository {
  constructor(private readonly prisma: PrimaService) {}

  async findById(id: Id): Promise<BettingProgression | null> {
    const progression = await this.prisma.bettingProgression.findUnique({
      where: {
        id: id.getValue(),
      },
    });

    if (!progression) {
      return null;
    }

    return this.toDomain(progression);
  }

  async findActiveByUserId(userId: Id): Promise<BettingProgression | null> {
    const progression = await this.prisma.bettingProgression.findFirst({
      where: {
        userId: userId.getValue(),

        status: {
          in: ['ACTIVE', 'LOOPING'],
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!progression) {
      return null;
    }

    return this.toDomain(progression);
  }

  async findByUserId(
    userId: Id,
    options: PaginationInput,
  ): Promise<Pagination<BettingProgression>> {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;

    const skip = (page - 1) * limit;

    const where: Prisma.BettingProgressionWhereInput = {
      userId: userId.getValue(),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.bettingProgression.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.bettingProgression.count({
        where,
      }),
    ]);

    return {
      data: items.map((item) => this.toDomain(item)),
      total,
      currentPage: page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  async cancelAll(userId: Id): Promise<void> {
    await this.prisma.bettingProgression.updateMany({
      where: {
        userId: userId.getValue(),

        status: {
          in: ['ACTIVE', 'LOOPING'],
        },
      },

      data: {
        status: 'FAILED',
        updatedAt: new Date(),
      },
    });
  }

  async save(progression: BettingProgression): Promise<void> {
    const props = progression.toProps();
    await this.prisma.bettingProgression.create({
      data: {
        id: progression.getId().getValue(),
        userId: progression.userId().getValue(),
        status: props.status,
        startedAt: props.startedAt,
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
        completedAt: props.completedAt,
        currentStep: props.currentStep,
        failedAt: props.failedAt,
      },
    });
  }

  async findBettingStepByProgressionId(
    progressionId: Id,
  ): Promise<BettingProgressionStep[]> {
    const steps = await this.prisma.bettingProgressionStep.findMany({
      where: {
        progressionId: progressionId.getValue(),
      },

      orderBy: {
        stepNumber: 'asc',
      },
    });

    return steps.map((step) => this.stepToDomain(step));
  }

  async findBettingStepByProgressionAndStep(
    progressionId: Id,
    stepNumber: number,
  ): Promise<BettingProgressionStep | null> {
    const step = await this.prisma.bettingProgressionStep.findFirst({
      where: {
        progressionId: progressionId.getValue(),
        stepNumber,
      },
    });

    if (!step) {
      return null;
    }

    return this.stepToDomain(step);
  }

  async findBettingStepByBetId(
    betId: Id,
  ): Promise<BettingProgressionStep | null> {
    const step = await this.prisma.bettingProgressionStep.findFirst({
      where: {
        betId: betId.getValue(),
      },
    });

    if (!step) {
      return null;
    }

    return this.stepToDomain(step);
  }

  async findBettingStepPendingByProgressionId(
    progressionId: Id,
  ): Promise<BettingProgressionStep | null> {
    const step = await this.prisma.bettingProgressionStep.findFirst({
      where: {
        progressionId: progressionId.getValue(),
        status: 'PENDING',
      },

      orderBy: {
        stepNumber: 'asc',
      },
    });

    if (!step) {
      return null;
    }

    return this.stepToDomain(step);
  }

  async saveBettingStep(step: BettingProgressionStep): Promise<void> {
    const props = step.toProps();
    await this.prisma.bettingProgressionStep.create({
      data: {
        id: step.getId().getValue(),
        progressionId: step.progressionId.getValue(),
        stepNumber: step.stepNumber,
        stakeAmount: step.stakeAmount.getValue(),
        betId: step.betId.getValue(),
        status: props.status,
        payoutAmount: props.payoutAmount?.getValue() ?? 0,
        completedAt: props.completedAt ?? null,
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
      },
    });
  }

  private toDomain(data: PrismaBettingProgression): BettingProgression {
    return new BettingProgression({
      id: new Id(data.id),
      userId: new Id(data.userId),
      startedAt: data.startedAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      currentStep: data.currentStep,
      status: data.status as any,
      completedAt: data.completedAt ?? undefined,
      failedAt: data.failedAt ?? undefined,
    });
  }

  private stepToDomain(
    data: PrismaBettingProgressionStep,
  ): BettingProgressionStep {
    return new BettingProgressionStep({
      id: new Id(data.id),
      progressionId: new Id(data.progressionId),
      stepNumber: data.stepNumber,
      stakeAmount: new Money(data.stakeAmount.toNumber()),
      betId: new Id(data.betId!),
      status: data.status as any,
      payoutAmount: new Money(data.payoutAmount.toNumber()),
      completedAt: data.completedAt ?? undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
