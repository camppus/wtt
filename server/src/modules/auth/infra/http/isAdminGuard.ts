import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import Id from '@/shared/entities/Id';
import type UserRepo from '@/modules/users/domain/repositories/UserRepo';
import type { ICaching } from '@/infra/caching';
import { UserRole } from '@/modules/users/domain/entities/Role';
import type { Request } from 'express';

interface UserCachedData {
  role: UserRole;
  isactive: boolean;
}

@Injectable()
export default class IsAdminGuard implements CanActivate {
  constructor(
    @Inject('UserRepo')
    private readonly userRepo: UserRepo,
    @Inject('ICaching')
    private readonly cache: ICaching,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    if (!request) {
      throw new Error('Must eauth');
    }
    const userId = new Id(request.headers['x-user-id'] as string);
    const cacheKey = `user:${userId.getValue()}:data`;
    const cached = await this.cache.get<UserCachedData>(cacheKey);
    if (cached) {
      if (cached.role !== UserRole.ADMIN) {
        throw new ForbiddenException('Administrator access required.');
      }
      return true;
    }
    const account = await this.userRepo.getById(userId);
    if (!account) {
      throw new UnauthorizedException('User not found.');
    }
    await this.cache.set(
      cacheKey,
      {
        id: userId.getValue(),
        role: account.getRole(),
        isactive: account.isActive(),
      },
      300,
    );

    if (!account.isAdmin()) {
      throw new ForbiddenException('Administrator access required.');
    }

    if (account.isActive()) {
      throw new Error('Must be active user');
    }
    return true;
  }
}
