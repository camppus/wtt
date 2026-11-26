import Game, { OddType } from '@/modules/games/domain/entities/Game';
import Entity from '@/shared/entities/Entiry';
import Id from '@/shared/entities/Id';

export enum BetPickStatus {
  PENDING = 'PENDING',
  WON = 'WON',
  LOST = 'LOST',
  VOID = 'VOID',
}

export interface BetPickProps {
  id: Id;
  betSlipId: Id;
  matchId: Id;
  oddType: OddType;
  oddValue: number;
  game: Game;
  status?: BetPickStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export default class BetPick extends Entity {
  constructor(private props: BetPickProps) {
    super(
      props.id,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
    );
    this.validate();
  }

  public static create(props: BetPickProps): BetPick {
    return new BetPick({
      ...props,
      status: props.status ?? BetPickStatus.PENDING,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  public getBetSlipId(): Id {
    return this.props.betSlipId;
  }

  // alias que o BetSlip usava
  public getSlipId(): Id {
    return this.props.betSlipId;
  }

  public getMatchId(): Id {
    return this.props.matchId;
  }

  public getOddType(): OddType {
    return this.props.oddType;
  }

  public getOddValue(): number {
    return this.props.oddValue;
  }

  public getGame(): Game {
    return this.props.game;
  }

  public getStatus(): BetPickStatus {
    return this.props.status ?? BetPickStatus.PENDING;
  }

  // ---------- Métodos que o BetSlip precisa ----------

  public isPending(): boolean {
    return this.getStatus() === BetPickStatus.PENDING;
  }

  public isWon(): boolean {
    return this.getStatus() === BetPickStatus.WON;
  }

  public isLost(): boolean {
    return this.getStatus() === BetPickStatus.LOST;
  }

  public isVoid(): boolean {
    return this.getStatus() === BetPickStatus.VOID;
  }

  public markAsWon(): void {
    this.assertPending('mark as won');
    this.props.status = BetPickStatus.WON;
    this.touch();
  }

  public markAsLost(): void {
    this.assertPending('mark as lost');
    this.props.status = BetPickStatus.LOST;
    this.touch();
  }

  public markAsVoid(): void {
    this.assertPending('mark as void');
    this.props.status = BetPickStatus.VOID;
    this.touch();
  }

  public conflictsWith(other: BetPick): boolean {
    if (this.getMatchId().equals(other.getMatchId())) return true;
    return false;
  }

  private validate(): void {
    if (this.props.oddValue < 1) {
      throw new Error('Odd value must be >= 1');
    }
    if (!this.props.game) {
      throw new Error('BetPick must have a game');
    }
  }

  private assertPending(action: string): void {
    if (!this.isPending()) {
      throw new Error(`Cannot ${action} on a ${this.getStatus()} BetPick`);
    }
  }

  public toProps(): BetPickProps {
    return { ...this.props };
  }
}
