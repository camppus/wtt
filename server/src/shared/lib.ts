import { PaginationInput } from './types';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function getPagination(data: PaginationInput) {
  const page = Number(data.page) || DEFAULT_PAGE;
  const limit = Number(data.limit) || DEFAULT_LIMIT;
  const securePage = Math.max(1, Math.floor(page));
  const secureLimit = Math.min(MAX_LIMIT, Math.max(1, Math.floor(limit)));
  const skip = (securePage - 1) * secureLimit;

  return {
    page: securePage,
    limit: secureLimit,
    skip,
    take: secureLimit,
  };
}

export function isUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol.includes('https');
  } catch {
    return false;
  }
}
