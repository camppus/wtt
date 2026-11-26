/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import PrismaService from '@/infra/database/Prisma/prisma.service';
import Id from '@/shared/entities/Id';
import ChallengeRepo from '../../domain/repositories/ChallengeRepo';
import Challenge, { ChallengeContext } from '../../domain/entities/Challenge';
import { Challenge as PrismaChallenge } from '@prisma/client';

@Injectable()
export default class PrismaChallengeRepo implements ChallengeRepo {
  constructor(private readonly prisma: PrismaService) {}

  async save(challenge: Challenge): Promise<void> {
    const data = challenge.toEntitie();

    await this.prisma.challenge.upsert({
      where: {
        id: data.id.getValue(),
      },

      create: {
        id: data.id.getValue(),
        userId: data.userId.getValue(),
        context: data.context,
        code: data.code,
        expiresAt: data.expiresAt,
        isUsed: data.isUsed,
        attempts: data.attempts,
        maxAttempts: data.maxAttempts,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },

      update: {
        code: data.code,
        expiresAt: data.expiresAt,
        isUsed: data.isUsed,
        attempts: data.attempts,
        maxAttempts: data.maxAttempts,
        updatedAt: data.updatedAt,
      },
    });
  }

  async getById(id: Id): Promise<Challenge | null> {
    const challenge = await this.prisma.challenge.findFirst({
      where: {
        id: id.getValue(),
      },
    });

    if (!challenge) {
      return null;
    }

    return this.toDomain(challenge);
  }

  async getActiveByUserAndContext(
    userId: Id,
    context: ChallengeContext,
  ): Promise<Challenge | null> {
    const challenge = await this.prisma.challenge.findFirst({
      where: {
        userId: userId.getValue(),
        context,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
        attempts: {
          lt: undefined,
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!challenge) {
      return null;
    }

    return this.toDomain(challenge);
  }

  async deleteExpired(before: Date): Promise<void> {
    await this.prisma.challenge.deleteMany({
      where: {
        expiresAt: {
          lt: before,
        },
      },
    });
  }

  private toDomain(challenge: PrismaChallenge): Challenge {
    return new Challenge({
      id: new Id(challenge.id),
      userId: new Id(challenge.userId),
      context: challenge.context as ChallengeContext,
      code: challenge.code,
      expiresAt: challenge.expiresAt,
      isUsed: challenge.isUsed,
      attempts: challenge.attempts,
      maxAttempts: challenge.maxAttempts,
      createdAt: challenge.createdAt,
      updatedAt: challenge.updatedAt,
    });
  }
}
