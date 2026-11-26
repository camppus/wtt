/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-base-to-string */
import axios, { AxiosError } from 'axios';
import { Injectable, Logger } from '@nestjs/common';

import { IApiMatch, IApiMatchService } from '..';
import { Odd, OddType, Score } from '@/modules/games/domain/entities/Game';

// ============================================================
// Odds API contracts
// ============================================================

interface OddsApiSport {
  key: string;
  group: string;
  title: string;
  active: boolean;
}

interface OddsApiOutcome {
  name: string;
  price: number;
}

interface OddsApiMarket {
  key: string;
  last_update: string;
  outcomes: OddsApiOutcome[];
}

interface OddsApiBookmaker {
  key: string;
  title: string;
  last_update?: string;
  markets: OddsApiMarket[];
}

interface OddsApiEvent {
  id: string;
  sport_key: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: OddsApiBookmaker[];
}

interface OddsApiScore {
  name: string;
  score: string | null;
}

interface OddsApiScoreEvent {
  id: string;
  sport_key: string;
  commence_time: string;
  completed: boolean;
  home_team: string;
  away_team: string;
  scores: OddsApiScore[] | null;
  last_update: string | null;
}

@Injectable()
export default class OddsApiService implements IApiMatchService {
  private readonly logger = new Logger(OddsApiService.name);

  private readonly baseUrl = 'https://api.the-odds-api.com/v4';

  private readonly apiKey = process.env.MATCH_API_KEY ?? '';

  private readonly regions = process.env.MATCH_API_REGIONS ?? 'eu';

  private readonly market = 'h2h';

  private readonly timeout = 15000;

  public async getMatches(): Promise<IApiMatch[]> {
    if (!this.apiKey) {
      this.logger.error('MATCH_API_KEY is not configured.');
      return [];
    }

    this.logger.log('Starting Odds API synchronization...');

    try {
      const leagues = await this.getSoccerLeagues();

      this.logger.log(`Found ${leagues.length} soccer leagues.`);

      const allMatches: IApiMatch[] = [];

      for (const league of leagues) {
        this.logger.log(`Processing league: ${league.title} (${league.key})`);

        try {
          const [oddsEvents, scoreEvents] = await Promise.all([
            this.getLeagueOdds(league.key),
            this.getLeagueScores(league.key),
          ]);

          const scoreMap = new Map(
            scoreEvents.map((event) => [event.id, event]),
          );

          const matches = oddsEvents.map((event) =>
            this.toApiMatch(event, scoreMap.get(event.id), league.title),
          );

          allMatches.push(...matches);

          this.logger.log(
            `[${league.title}] Odds: ${oddsEvents.length} | Scores: ${scoreEvents.length} | Processed: ${matches.length}`,
          );
        } catch (error) {
          this.logError(`Failed to process league ${league.title}`, error);
        }
      }

      this.logger.log(
        `Synchronization completed. Total matches: ${allMatches.length}`,
      );

      this.logger.debug(
        `FINAL MATCHES:\n${JSON.stringify(allMatches, null, 2)}`,
      );

      return allMatches;
    } catch (error) {
      this.logError('Failed to synchronize matches', error);
      return [];
    }
  }

  public async getMatchById(matchId: string): Promise<IApiMatch | null> {
    this.logger.log(`Searching for match: ${matchId}`);

    const matches = await this.getMatches();

    const match = matches.find((item) => item.id === matchId) ?? null;

    if (!match) {
      this.logger.warn(`Match not found: ${matchId}`);
      return null;
    }

    this.logger.log(`Match found: ${match.homeTeam} vs ${match.awayTeam}`);

    return match;
  }

  // ==========================================================
  // Leagues
  // ==========================================================

  private async getSoccerLeagues(): Promise<OddsApiSport[]> {
    const endpoint = `${this.baseUrl}/sports/`;

    const response = await axios.get<OddsApiSport[]>(endpoint, {
      params: {
        apiKey: this.apiKey,
        all: true,
      },
      timeout: this.timeout,
    });

    this.logQuota(response.headers);

    const leagues = response.data.filter(
      (sport) => sport.group?.toLowerCase() === 'soccer',
    );

    this.logger.log(`Soccer leagues:\n${JSON.stringify(leagues, null, 2)}`);

    return leagues;
  }

  // ==========================================================
  // Odds
  // ==========================================================

  private async getLeagueOdds(leagueKey: string): Promise<OddsApiEvent[]> {
    const endpoint = `${this.baseUrl}/sports/${leagueKey}/odds/`;

    try {
      const response = await axios.get<OddsApiEvent[]>(endpoint, {
        params: {
          apiKey: this.apiKey,
          regions: this.regions,
          markets: this.market,
          oddsFormat: 'decimal',
          dateFormat: 'iso',
        },
        timeout: this.timeout,
      });

      this.logger.debug(
        `[ODDS] ${leagueKey} RESPONSE:\n${JSON.stringify(
          response.data,
          null,
          2,
        )}`,
      );

      return response.data;
    } catch (error) {
      this.logError(`[ODDS] Error fetching ${leagueKey}`, error);

      return [];
    }
  }

  private async getLeagueScores(
    leagueKey: string,
  ): Promise<OddsApiScoreEvent[]> {
    const endpoint = `${this.baseUrl}/sports/${leagueKey}/scores/`;

    try {
      const response = await axios.get<OddsApiScoreEvent[]>(endpoint, {
        params: {
          apiKey: this.apiKey,
          daysFrom: 3,
          dateFormat: 'iso',
        },
        timeout: this.timeout,
      });

      this.logger.log(
        `[SCORES] ${leagueKey} | HTTP ${response.status} | Events: ${response.data.length}`,
      );

      this.logQuota(response.headers);

      this.logger.debug(
        `[SCORES] ${leagueKey} RESPONSE:\n${JSON.stringify(
          response.data,
          null,
          2,
        )}`,
      );

      return response.data;
    } catch (error) {
      this.logError(`[SCORES] Error fetching ${leagueKey}`, error);

      return [];
    }
  }

  private toApiMatch(
    event: OddsApiEvent,
    scoreEvent: OddsApiScoreEvent | undefined,
    league: string,
  ): IApiMatch {
    const scores = scoreEvent ? this.toScore(scoreEvent) : this.emptyScore();

    return {
      id: event.id,
      startAt: new Date(event.commence_time),
      completed: scoreEvent?.completed ?? false,
      homeTeam: event.home_team,
      awayTeam: event.away_team,
      scores,
      lastUpdate: this.getLastUpdate(event),
      odds: this.toOdds(event),
      league,
    };
  }

  private toScore(event: OddsApiScoreEvent): Score {
    if (!event.scores?.length) {
      return this.emptyScore();
    }

    const home = event.scores.find((item) => item.name === event.home_team);

    const away = event.scores.find((item) => item.name === event.away_team);

    return {
      home: this.parseScore(home?.score),
      away: this.parseScore(away?.score),
    };
  }

  private emptyScore(): Score {
    return {
      home: 0,
      away: 0,
    };
  }

  private parseScore(value: string | null | undefined): number {
    if (value === null || value === undefined) {
      return 0;
    }

    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : 0;
  }

  private toOdds(event: OddsApiEvent): Odd[] {
    const bestOdds = new Map<string, Odd>();

    for (const bookmaker of event.bookmakers ?? []) {
      for (const market of bookmaker.markets ?? []) {
        if (market.key !== this.market) {
          continue;
        }

        for (const outcome of market.outcomes ?? []) {
          const type = this.getOutcomeType(
            outcome.name,
            event.home_team,
            event.away_team,
          );

          if (!type || !Number.isFinite(outcome.price)) {
            continue;
          }

          const current = bestOdds.get(type);

          if (!current || outcome.price > current.value) {
            bestOdds.set(type, {
              type,
              value: outcome.price,
            });
          }
        }
      }
    }

    return Array.from(bestOdds.values());
  }

  private getOutcomeType(
    outcomeName: string,
    homeTeam: string,
    awayTeam: string,
  ): OddType | null {
    const normalized = outcomeName.trim().toLowerCase();

    if (normalized === homeTeam.trim().toLowerCase()) {
      return 'HOME' as OddType;
    }

    if (normalized === awayTeam.trim().toLowerCase()) {
      return 'AWAY' as OddType;
    }

    if (
      normalized === 'draw' ||
      normalized === 'tie' ||
      normalized === 'empate'
    ) {
      return 'DRAW' as OddType;
    }

    return null;
  }

  private getLastUpdate(event: OddsApiEvent): Date {
    const updates: number[] = [];

    for (const bookmaker of event.bookmakers ?? []) {
      for (const market of bookmaker.markets ?? []) {
        const timestamp = new Date(market.last_update).getTime();

        if (Number.isFinite(timestamp)) {
          updates.push(timestamp);
        }
      }
    }

    if (updates.length === 0) {
      return new Date();
    }

    return new Date(Math.max(...updates));
  }

  private logQuota(headers: Record<string, unknown>): void {
    this.logger.log(
      `API QUOTA | Used: ${headers['x-requests-used'] ?? 'N/A'} | Remaining: ${headers['x-requests-remaining'] ?? 'N/A'} | Last cost: ${headers['x-requests-last'] ?? 'N/A'}`,
    );
  }

  private logError(context: string, error: unknown): void {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      this.logger.error(
        `${context} | HTTP: ${
          axiosError.response?.status ?? 'No response'
        } | Message: ${axiosError.message}`,
      );

      if (axiosError.response?.data) {
        this.logger.error(
          `API ERROR RESPONSE:\n${JSON.stringify(
            axiosError.response.data,
            null,
            2,
          )}`,
        );
      }

      if (axiosError.response?.headers) {
        this.logQuota(axiosError.response.headers);
      }

      return;
    }

    this.logger.error(
      `${context}: ${error instanceof Error ? error.message : String(error)}`,
      error instanceof Error ? error.stack : undefined,
    );
  }
}
