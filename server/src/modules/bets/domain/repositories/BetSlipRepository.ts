import Id from '@/shared/entities/Id';
import BetSlip from '../entities/BetSlip';
import { BetSlipStatus } from '../entities/BetSlip';
import TransactionContext from '@/shared/types';

export default interface BetSlipRepository {
  findById(id: Id): Promise<BetSlip | null>;

  findByUserId(
    userId: Id,
    options?: {
      status?: BetSlipStatus;
      limit?: number;
      offset?: number;
    },
  ): Promise<BetSlip[]>;

  countByUserId(userId: Id, status?: BetSlipStatus): Promise<number>;

  save(betSlip: BetSlip, transaction?: TransactionContext): Promise<void>;
}
