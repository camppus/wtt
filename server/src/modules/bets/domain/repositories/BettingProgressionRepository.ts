import Id from '@/shared/entities/Id';
import { Pagination, PaginationInput } from '@/shared/types';
import BettingProgression from '../entities/BettingProgression';
import BettingProgressionStep from '../entities/BettingProgressionStep';

export default interface BettingProgressionRepository {
  findById(id: Id): Promise<BettingProgression | null>;

  findActiveByUserId(userId: Id): Promise<BettingProgression | null>;

  findByUserId(
    userId: Id,
    options: PaginationInput,
  ): Promise<Pagination<BettingProgression>>;

  cancelAll(userId: Id): Promise<void>;

  save(progression: BettingProgression): Promise<void>;

  findBettingStepByProgressionId(
    progressionId: Id,
  ): Promise<BettingProgressionStep[]>;

  findBettingStepByProgressionAndStep(
    progressionId: Id,
    stepNumber: number,
  ): Promise<BettingProgressionStep | null>;

  findBettingStepByBetId(betId: Id): Promise<BettingProgressionStep | null>;

  findBettingStepPendingByProgressionId(
    progressionId: Id,
  ): Promise<BettingProgressionStep | null>;

  saveBettingStep(step: BettingProgressionStep): Promise<void>;
}
