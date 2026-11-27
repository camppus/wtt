import Id from '@/shared/entities/Id';
import BettingProgressionStep from '../entities/BettingProgressionStep';

export default interface BettingProgressionStepRepository {
  findById(id: Id): Promise<BettingProgressionStep | null>;

  findByProgressionId(progressionId: Id): Promise<BettingProgressionStep[]>;

  findByProgressionAndStep(
    progressionId: Id,
    stepNumber: number,
  ): Promise<BettingProgressionStep | null>;

  findByBetId(betId: Id): Promise<BettingProgressionStep | null>;

  findPendingByProgressionId(
    progressionId: Id,
  ): Promise<BettingProgressionStep | null>;

  save(step: BettingProgressionStep): Promise<void>;
}
