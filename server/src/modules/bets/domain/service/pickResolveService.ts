import { Injectable } from '@nestjs/common';
import CreateBetPickDto from '../../application/dto/createBetPickDto';

@Injectable()
export default class PickResolveService {
  public handle(picks: CreateBetPickDto[]) {
    if (!picks.length) {
      throw new Error('A aposta precisa ter pelo menos um jogo');
    }
    const matchIds = picks.map((pick) => pick.matchId);

    if (new Set(matchIds).size !== matchIds.length) {
      throw new Error('Não podes selecionar o mesmo jogo mais de uma vez');
    }
    return matchIds;
  }
}
