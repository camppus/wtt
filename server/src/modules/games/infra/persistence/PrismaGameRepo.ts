/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { Prisma, Match } from '@prisma/client';
import Id from '@/shared/entities/Id';
import { Pagination, PaginationInput } from '@/shared/types';
import PrimaService from '@/infra/database/Prisma/prisma.service';

import Game, {
  GameProps,
  MatchStatus,
  Score,
} from '../../domain/entities/Game';

import GameRepo from '../../domain/repositories/GameRepo';

@Injectable()
export default class PrismaGameRepo implements GameRepo {
  constructor(private readonly prisma: PrimaService) {}

  public async save(game: Game): Promise<void> {
    const data = game.toEntity();

    await this.prisma.match.upsert({
      where: {
        id: data.id.getValue(),
      },

      create: {
        id: data.id.getValue(),
        externId: data.externId,
        key: data.key,
        homeTeam: data.homeTeam,
        awayTeam: data.awayTeam,
        startAt: data.startAt,
        status: data.status,
        completed: data.completed,
        scores: data.scores as any,
        odds: data.odds as any,
      },

      update: {
        externId: data.externId,
        key: data.key,
        homeTeam: data.homeTeam,
        awayTeam: data.awayTeam,
        startAt: data.startAt,
        status: data.status,
        completed: data.completed,
        scores: data.scores as any,
      },
    });
  }

  public async getById(id: Id): Promise<Game | null> {
    const game = await this.prisma.match.findUnique({
      where: { id: id.getValue() },
    });

    return game ? this.toDomain(game) : null;
  }

  public async getByExternId(externId: string): Promise<Game | null> {
    const game = await this.prisma.match.findUnique({
      where: { externId },
    });

    return game ? this.toDomain(game) : null;
  }

  public async getAll(pagination: PaginationInput): Promise<Pagination<Game>> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const skip = (page - 1) * limit;

    const [games, total] = await this.prisma.$transaction([
      this.prisma.match.findMany({
        skip,
        take: limit,
        orderBy: { startAt: 'desc' },
      }),
      this.prisma.match.count(),
    ]);

    return {
      data: games.map((game) => this.toDomain(game)),
      currentPage: page,
      lastPage: Math.ceil(total / limit),
      limit,
      total,
    };
  }

  public async getGamesToClose(date: Date): Promise<Game[]> {
    const games = await this.prisma.match.findMany({
      where: {
        status: 'OPEN',
        startAt: { lte: date },
      },
    });

    return games.map((game) => this.toDomain(game));
  }

  public async getLiveGames(date: Date): Promise<Game[]> {
    const games = await this.prisma.match.findMany({
      where: {
        status: 'OPEN',
        startAt: { lte: date },
      },
    });

    return games.map((game) => this.toDomain(game));
  }

  private toDomain(data: Match): Game {
    const props: GameProps = {
      id: new Id(data.id),
      externId: data.externId,
      key: data.key,
      homeTeam: data.homeTeam,
      awayTeam: data.awayTeam,
      startAt: data.startAt,
      status: data.status as MatchStatus,
      completed: data.completed,
      odds: data.odds as any,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      scores: this.toScore(data.scores) as any,
    };

    return new Game(props);
  }

  private toScore(value: Prisma.JsonValue): Score | null {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    const score = value;

    if (typeof score.home !== 'number' || typeof score.away !== 'number') {
      return null;
    }

    return {
      home: score.home,
      away: score.away,
    };
  }
}
