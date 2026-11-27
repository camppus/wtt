import Id from '@/shared/entities/Id';
import BetPick from '../entities/BetPick';
import TransactionContext from '@/shared/types';

export default interface BetPickRepository {
  findById(id: Id): Promise<BetPick | null>;
  findByBetSlipId(betSlipId: Id): Promise<BetPick[]>;
  findByMatchId(matchId: Id): Promise<BetPick[]>;
  save(pick: BetPick, transaction?: TransactionContext): Promise<void>;
  saveMany(picks: BetPick[], transaction?: TransactionContext): Promise<void>;
}
