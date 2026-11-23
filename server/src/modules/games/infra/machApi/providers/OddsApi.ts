import axios from 'axios';
import { Logger } from '@nestjs/common';
import { IApiMatch, IApiMatchService } from '..';
import { Score } from '@/modules/games/domain/entities/Game';

interface OddsApiScore {
  name: string;
  score: string;
}

interface OddsApiMatch {
  id: string;
  commence_time: string;
  completed: boolean;
  home_team: string;
  away_team: string;
  scores: OddsApiScore[] | null;
  last_update: string | null;
}

interface OddsApiSport {
  key: string;
  group: string;
  title: string;
}

export default class OddsApiService implements IApiMatchService {
  private readonly apiKey = process.env.MATCH_API_KEY ?? '';
  private readonly baseUrl = 'https://api.the-odds-api.com/v4';
  private readonly logger = new Logger(OddsApiService.name);

  public async getMatchById(matchId: string): Promise<IApiMatch | null> {
    try {
      const matches = await this.getMatches();

      return matches.find((match) => match.id === matchId) ?? null;
    } catch (error) {
      this.logger.error(`Error fetching match ${matchId}`, error);

      return null;
    }
  }

  public async getMatches(): Promise<IApiMatch[]> {
    try {
      const leagues = await this.getSoccerLeagues();

      const allMatches: IApiMatch[] = [];

      for (const league of leagues) {
        try {
          const { data } = await axios.get<OddsApiMatch[]>(
            `${this.baseUrl}/sports/${league.key}/scores/`,
            {
              params: {
                apiKey: this.apiKey,
              },
            },
          );

          const matches = data.map((match) => this.toApiMatch(match));

          allMatches.push(...matches);
        } catch (error) {
          this.logger.error(`Error fetching league ${league.title}`, error);
        }
      }

      return allMatches;
    } catch (error) {
      this.logger.error('Error fetching soccer leagues', error);

      return [];
    }
  }

  private async getSoccerLeagues(): Promise<OddsApiSport[]> {
    const { data } = await axios.get<OddsApiSport[]>(
      `${this.baseUrl}/sports/`,
      {
        params: {
          apiKey: this.apiKey,
        },
      },
    );

    return data.filter((sport) => sport.group === 'Soccer');
  }

  private toApiMatch(match: OddsApiMatch): IApiMatch {
    return {
      id: match.id,
      startAt: new Date(match.commence_time),
      homeTeam: match.home_team,
      awayTeam: match.away_team,
      scores: this.toScores(match.scores),
      lastUpdate: match.last_update ? new Date(match.last_update) : new Date(),
      completed: match.completed,
    };
  }

  private toScores(scores: OddsApiScore[] | null): Score[] {
    if (!scores) {
      return [];
    }

    return scores
      .filter((score) => score.score !== null)
      .map((score) => ({
        home: score.name === 'home' ? Number(score.score) : 0,
        away: score.name === 'away' ? Number(score.score) : 0,
      }));
  }
}
