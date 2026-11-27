import Id from '@/shared/entities/Id';
import BetSlip from '../entities/BetSlip';
import LedgerEntry from '@/modules/transactions/domain/entities/LedgerEntry';
import Money from '@/shared/entities/Money';
import { PaginationInput, Pagination } from '@/shared/types';
import BetPick from '../entities/BetPick';

export default interface BetSlipRepository {
  findById(id: Id): Promise<BetSlip | null>;
  findPicks(betSlipId: Id): Promise<BetPick[]>;
  findPick(pickId: Id): Promise<BetPick>;
  findByUserId(
    userId: Id,
    options: PaginationInput,
  ): Promise<Pagination<BetSlip>>;
  findAll(options: PaginationInput): Promise<Pagination<BetSlip>>;
  update(betSlip: BetSlip): Promise<void>;

  transactionalBetCreate(data: {
    bet: BetSlip;
    decriseAmount: Money;
    ledger?: LedgerEntry;
  }): Promise<void>;

  hasBetToday(userId: Id): Promise<boolean>;
}
