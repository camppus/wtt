import Entity from '@/shared/entities/Entiry';
import Id from '@/shared/entities/Id';

export enum MatchStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  FINISHED = 'FINISHED',
  CANCELED = 'CANCELED',
}

export enum OddType {
  HOME_WIN = 'HOME_WIN',
  DRAW = 'DRAW',
  AWAY_WIN = 'AWAY_WIN',
}

export interface Odd {
  id: Id;
  matchId: Id;
  type: OddType;
  value: number;
}

export interface Score {
  home: number;
  away: number;
}

export interface GameProps {
  id: Id;
  externId: string;
  key: string;
  homeTeam: string;
  awayTeam: string;
  startAt: Date;
  status: MatchStatus;
  completed: boolean;
  scores: Score[];
  createdAt: Date;
  updatedAt: Date;
  odds: Odd[];
}

export default class Game extends Entity {
  constructor(private readonly props: GameProps) {
    super(props.id, props.createdAt, props.updatedAt);
  }

  public toEntity(): GameProps {
    return {
      ...this.props,
      odds: [...this.props.odds],
      scores: [...this.props.scores],
    };
  }

  public getStatus(): MatchStatus {
    return this.props.status;
  }

  public getOdds(): Odd[] {
    return [...this.props.odds];
  }

  public getScores(): Score[] {
    return [...this.props.scores];
  }

  public isFinished(): boolean {
    return this.props.status === MatchStatus.FINISHED;
  }

  public isCanceled(): boolean {
    return this.props.status === MatchStatus.CANCELED;
  }

  public cancel(): void {
    if (
      this.props.status !== MatchStatus.OPEN &&
      this.props.status !== MatchStatus.CLOSED
    ) {
      throw new Error('Only open or closed games can be canceled');
    }

    this.props.status = MatchStatus.CANCELED;
    this.touch();
  }

  public close(): void {
    if (this.props.status !== MatchStatus.OPEN) {
      throw new Error('Only open games can be closed');
    }

    this.props.status = MatchStatus.CLOSED;
    this.touch();
  }

  public finish(): void {
    if (this.props.status !== MatchStatus.CLOSED) {
      throw new Error('Only closed games can be finished');
    }

    if (this.props.completed) {
      throw new Error('Game is already completed');
    }

    this.props.status = MatchStatus.FINISHED;
    this.props.completed = true;
    this.touch();
  }

  public getExternId(): string {
    return this.props.externId;
  }

  public updateScores(scores: Score[]): void {
    if (this.props.status === MatchStatus.FINISHED) {
      throw new Error('Cannot update scores of a finished game');
    }

    if (this.props.status === MatchStatus.CANCELED) {
      throw new Error('Cannot update scores of a canceled game');
    }

    this.props.scores = scores;
    this.touch();
  }
}
