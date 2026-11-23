import Id from '@/shared/entities/Id';
import { Pagination, PaginationInput } from '@/shared/types';
import Widthdrawsl from '../entities/Widthdraw';

export default interface WidthDrawlRepo {
  save(widthdrals: Widthdrawsl): Promise<void>;
  getById(id: Id): Promise<Widthdrawsl | null>;
  getWidhdrawsls(pagination: PaginationInput): Promise<Pagination<Widthdrawsl>>;
  getWidhdrawslsByUserid(
    pagination: PaginationInput,
    userId: Id,
  ): Promise<Pagination<Widthdrawsl>>;
}
