import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import GetGameUseCase from '@/modules/games/application/usecase/GetGameUseCase';
import { MatchStatus, OddType } from '@/modules/games/domain/entities/Game';
import Id from '@/shared/entities/Id';
import BettingProgression from '../entities/BettingProgression';

interface ResolvePickInput {
  matchId: string;
  oddType: OddType;
}

@Injectable()
export default class ResolvePickService {
  private readonly MINIMUM_START_TIME = 5 * 60 * 1000;

  constructor(private readonly getGameUseCase: GetGameUseCase) {}

  public async handle(
    picks: ResolvePickInput[],
    userProgression: BettingProgression,
  ) {
    if (!picks.length) {
      throw new BadRequestException('A aposta precisa ter pelo menos um jogo');
    }

    const matchIds = picks.map((pick) => pick.matchId);

    if (new Set(matchIds).size !== matchIds.length) {
      throw new BadRequestException(
        'Não podes selecionar o mesmo jogo mais de uma vez',
      );
    }

    const now = Date.now();
    const isMaxedSteps = userProgression.isInLooping();

    return Promise.all(
      picks.map(async (pick) => {
        const game = await this.getGameUseCase.getEntitie(new Id(pick.matchId));

        if (!game) {
          throw new NotFoundException(`Jogo ${pick.matchId} não encontrado`);
        }

        const gameData = game.toEntity();

        if (game.getStatus() !== MatchStatus.OPEN || game.isCompleted()) {
          throw new BadRequestException(
            `O jogo ${gameData.homeTeam} vs ${gameData.awayTeam} não está disponível para apostas`,
          );
        }

        const startAt = new Date(gameData.startAt).getTime();

        if (!Number.isFinite(startAt)) {
          throw new BadRequestException(
            `Data de início inválida para o jogo ${gameData.homeTeam} vs ${gameData.awayTeam}`,
          );
        }

        const remainingTime = startAt - now;

        if (remainingTime < this.MINIMUM_START_TIME) {
          throw new BadRequestException(
            `O jogo ${gameData.homeTeam} vs ${gameData.awayTeam} precisa de pelo menos 5 minutos até ao início`,
          );
        }

        const selectedOdd = game
          .getOdds()
          .find((odd) => odd.type === pick.oddType);

        if (!selectedOdd) {
          throw new BadRequestException(
            `A odd ${pick.oddType} não está disponível para o jogo ${gameData.homeTeam} vs ${gameData.awayTeam}`,
          );
        }

        if (!Number.isFinite(selectedOdd.value) || selectedOdd.value <= 1) {
          throw new BadRequestException(
            `Odd inválida para o jogo ${gameData.homeTeam} vs ${gameData.awayTeam}`,
          );
        }

        return {
          matchId: gameData.id,
          oddType: selectedOdd.type,
          oddValue: isMaxedSteps
            ? userProgression.getMaxOdds()
            : selectedOdd.value,
          game,
        };
      }),
    );
  }
}
