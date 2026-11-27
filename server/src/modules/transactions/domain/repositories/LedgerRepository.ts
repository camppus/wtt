import Id from '@/shared/entities/Id';
import LedgerEntry from '../entities/LedgerEntry';
import TransactionContext, {
  Pagination,
  PaginationInput,
} from '@/shared/types';

export default interface LedgerRepository {
  findById(id: Id): Promise<LedgerEntry | null>;
  findByUserId(
    userId: Id,
    options: PaginationInput,
  ): Promise<Pagination<LedgerEntry>>;
  findByReferenceId(referenceId: Id): Promise<LedgerEntry | null>;
  save(entry: LedgerEntry, transaction?: TransactionContext): Promise<void>;
}
