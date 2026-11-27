import Id from '@/shared/entities/Id';
import BettingProgression from '../../domain/entities/BettingProgression';

export default class GetUserProgrationUseCase {
  public handle(userid: Id): Promise<BettingProgression> {
    throw new Error('not empleeted');
  }
}
