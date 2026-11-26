import Id from '@/shared/entities/Id';
import Challenge, { ChallengeContext } from '../entities/Challenge';

export default interface ChallengeRepo {
  save(challenge: Challenge): Promise<void>;
  getById(id: Id): Promise<Challenge | null>;
  getActiveByUserAndContext(
    userId: Id,
    context: ChallengeContext,
  ): Promise<Challenge | null>;
  deleteExpired(before: Date): Promise<void>;
}
