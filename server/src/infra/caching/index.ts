import { Global, Module } from '@nestjs/common';
import { RedisCache } from './providers/Redis';

export interface ICaching {
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  get<T>(key: string): Promise<T | null>;
  delete(key: string): Promise<void>;
  has(key: string): Promise<boolean>;
}

@Global()
@Module({
  providers: [
    RedisCache,

    {
      provide: 'ICaching',
      useExisting: RedisCache,
    },
  ],

  exports: ['ICaching'],
})
export class CacheModule {}
