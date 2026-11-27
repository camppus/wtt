import Id from '@/shared/entities/Id';
import BettingProgression from '../entities/BettingProgression';
import { ProgressionStatus } from '../entities/BettingProgression';

export default interface BettingProgressionRepository {
  findById(id: Id): Promise<BettingProgression | null>;

  findActiveByUserId(userId: Id): Promise<BettingProgression | null>;

  findByUserId(
    userId: Id,
    options?: {
      status?: ProgressionStatus;
      limit?: number;
      offset?: number;
    },
  ): Promise<BettingProgression[]>;

  save(progression: BettingProgression): Promise<void>;
}
