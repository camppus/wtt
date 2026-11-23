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
