/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import Id from '@/shared/entities/Id';
import Money from '@/shared/entities/Money';
import { Pagination, PaginationInput } from '@/shared/types';
import BetSlip from '../../domain/entities/BetSlip';
import BetPick from '../../domain/entities/BetPick';
import type BetSlipRepository from '../../domain/repositories/BetSlipRepository';
import LedgerEntry from '@/modules/transactions/domain/entities/LedgerEntry';
import { getPagination } from '@/shared/lib';
import PrimaService from '@/infra/database/Prisma/prisma.service';
import Game from '@/modules/games/domain/entities/Game';

@Injectable()
export default class PrismaBetSlipRepository implements BetSlipRepository {
  constructor(private readonly prisma: PrimaService) {}
  async findById(id: Id): Promise<BetSlip | null> {
    const bet = await this.prisma.betSlip.findUnique({
      where: {
        id: id.getValue(),
      },
      include: {
        picks: {
          include: {
            match: true,
          },
        },
      },
    });

    if (!bet) {
      return null;
    }

    return this.toDomain(bet);
  }

  async findPicks(betSlipId: Id): Promise<BetPick[]> {
    const picks = await this.prisma.betPick.findMany({
      where: {
        betSlipId: betSlipId.getValue(),
      },
      include: {
        match: true,
      },
    });

    return picks.map((pick) => this.pickToDomain(pick));
  }

  async findPick(pickId: Id): Promise<BetPick> {
    const pick = await this.prisma.betPick.findUnique({
      where: {
        id: pickId.getValue(),
      },
      include: {
        match: true,
      },
    });

    if (!pick) {
      throw new Error('Bet pick not found');
    }

    return this.pickToDomain(pick);
  }

  async findByUserId(
    userId: Id,
    options: PaginationInput,
  ): Promise<Pagination<BetSlip>> {
    return this.paginate(
      {
        userId: userId.getValue(),
      },
      options,
    );
  }

  async findAll(options: PaginationInput): Promise<Pagination<BetSlip>> {
    return this.paginate({}, options);
  }

  private async paginate(
    where: Prisma.BetSlipWhereInput,
    options: PaginationInput,
  ): Promise<Pagination<BetSlip>> {
    const { page, skip, take, limit } = getPagination(options);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.betSlip.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          picks: {
            include: {
              match: true,
            },
          },
        },
      }),

      this.prisma.betSlip.count({
        where,
      }),
    ]);

    return {
      data: items.map((item) => this.toDomain(item)),
      total,
      currentPage: page,
      limit: take,
      lastPage: Math.ceil(total / limit),
    };
  }

  async update(betSlip: BetSlip): Promise<void> {
    const props = betSlip.toProps();

    await this.prisma.betSlip.update({
      where: {
        id: betSlip.getId().getValue(),
      },
      data: {
        status: props.status,
        updatedAt: props.updatedAt,
        resolvedAt: props.resolvedAt,
      },
    });
  }

  async transactionalBetCreate(data: {
    bet: BetSlip;
    decriseAmount: Money;
    ledger?: LedgerEntry;
  }): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const bet = data.bet;
      const betProps = bet.toProps();

      await tx.betSlip.create({
        data: {
          id: bet.getId().getValue(),
          userId: bet.userId().getValue(),

          stake: bet.stake().getValue(),

          status: betProps.status,

          createdAt: betProps.createdAt,

          possibleWin: bet.possibleWin().getValue(),

          totalOdd: bet.totalOdd(),

          resolvedAt: null,

          picks: {
            create: bet.picks().map((pick) => {
              const props = pick.toProps();

              return {
                id: pick.getId().getValue(),

                matchId: pick.getMatchId().getValue(),

                oddType: props.oddType,

                oddValue: props.oddValue,

                status: props.status,

                createdAt: props.createdAt,

                updatedAt: props.updatedAt,
              };
            }),
          },
        },
      });

      /*
       * Free bet:
       *
       * Não existe débito nem ledger.
       * A aposta já foi criada acima.
       */
      if (!data.ledger) {
        return;
      }

      const ledger = data.ledger;
      const ledgerProps = ledger.toProps();

      await tx.ledgerEntry.create({
        data: {
          id: ledger.getId().getValue(),

          userId: ledger.userId.getValue(),

          amount: ledger.amount.getValue(),

          balanceBefore: ledgerProps.balanceBefore.getValue(),

          balanceAfter: ledgerProps.balanceAfter.getValue(),

          direction: ledgerProps.direction,

          type: ledgerProps.type,

          description: ledgerProps.description,

          referenceId: ledgerProps.referenceId?.getValue() ?? null,

          createdAt: ledgerProps.createdAt,

          updatedAt: ledgerProps.updatedAt,
        },
      });

      await tx.user.update({
        where: {
          id: bet.userId().getValue(),
        },

        data: {
          balance: data.decriseAmount.getValue(),
        },
      });
    });
  }

  async hasBetToday(userId: Id): Promise<boolean> {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const startOfNextDay = new Date(startOfDay);
    startOfNextDay.setDate(startOfNextDay.getDate() + 1);
    const bet = await this.prisma.betSlip.findFirst({
      where: {
        userId: userId.getValue(),
        stake: 0,
        createdAt: {
          gte: startOfDay,
          lt: startOfNextDay,
        },
      },

      select: {
        id: true,
      },
    });
    return bet !== null;
  }

  private toDomain(data: PrismaBetSlipWithPicks): BetSlip {
    return new BetSlip({
      id: new Id(data.id),
      userId: new Id(data.userId),
      picks: data.picks.map((pick) => this.pickToDomain(pick)),
      stake: new Money(data.stake.toNumber()),
      possibleWin: new Money(data.possibleWin.toNumber()),
      totalOdd: data.totalOdd.toNumber(),
      status: data.status as any,
      createdAt: data.createdAt,
      resolvedAt: data.resolvedAt ?? undefined,
      updatedAt: data.createdAt,
    });
  }

  private pickToDomain(data: PrismaBetPickWithMatch): BetPick {
    return new BetPick({
      id: new Id(data.id),
      betSlipId: new Id(data.betSlipId),
      matchId: new Id(data.matchId),
      oddType: data.oddType as any,
      oddValue: data.oddValue.toNumber(),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      status: data.status as any,
      game: this.gameToDomain(data.match),
    });
  }

  private gameToDomain(data: PrismaMatch): Game {
    return new Game({
      id: new Id(data.id),
      homeTeam: data.homeTeam,
      awayTeam: data.awayTeam,
      status: data.status as any,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      completed: data.completed,
      externId: data.externId,
      key: data.key,
      odds: data.odds as any,
      scores: data.scores as any,
      startAt: data.startAt,
    });
  }
}

type PrismaBetSlipWithPicks = Prisma.BetSlipGetPayload<{
  include: {
    picks: {
      include: {
        match: true;
      };
    };
  };
}>;

type PrismaBetPickWithMatch = Prisma.BetPickGetPayload<{
  include: {
    match: true;
  };
}>;

type PrismaMatch = Prisma.MatchGetPayload<{}>;
