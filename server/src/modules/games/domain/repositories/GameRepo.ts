import Id from '@/shared/entities/Id';
import { Pagination, PaginationInput } from '@/shared/types';
import Game from '../entities/Game';

export default interface GameRepo {
  save(game: Game): Promise<void>;
  getById(id: Id): Promise<Game | null>;
  getAll(pagination: PaginationInput): Promise<Pagination<Game>>;
  getByExternId(externId: string): Promise<Game | null>;
  getGamesToClose(date: Date): Promise<Game[]>;
  getLiveGames(date: Date): Promise<Game[]>;
}
