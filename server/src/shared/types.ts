/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface Pagination<T> {
  data: T[];
  total: number;
  lastPage: number;
  currentPage: number;
  limit: number;
}

export interface PaginationInput {
  page: number;
  limit: number;
}

export default interface TransactionContext {}

export default interface UnitOfWork {
  execute<T>(work: (transaction: TransactionContext) => Promise<T>): Promise<T>;
}
