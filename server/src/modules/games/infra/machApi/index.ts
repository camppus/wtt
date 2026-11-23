import { Score } from '../../domain/entities/Game';
export interface IApiMatch {
  id: string;
  startAt: Date;
  completed: boolean;
  homeTeam: string;
  awayTeam: string;
  scores: Score[];
  lastUpdate: Date;
}

export interface IApiMatchService {
  getMatches(): Promise<IApiMatch[]>;
  getMatchById(matchId: string): Promise<IApiMatch | null>;
}
