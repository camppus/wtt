import { Odd, Score } from '../../domain/entities/Game';
export interface IApiMatch {
  id: string;
  startAt: Date;
  completed: boolean;
  homeTeam: string;
  awayTeam: string;
  scores: Score;
  lastUpdate: Date;
  odds: Odd[];
  league: string;
}

export interface IApiMatchService {
  getMatches(): Promise<IApiMatch[]>;
  getMatchById(matchId: string): Promise<IApiMatch | null>;
}
