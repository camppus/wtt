import { UserRole } from '@/modules/users/domain/entities/Role';
import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import type { Request } from 'express';

export interface AuthenticatedRequest {
  role: UserRole;
  id: string;
  isActive: boolean;
}

export const CurrentUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request: Request = ctx.switchToHttp().getRequest();
    const userId = request.headers['x-user-id'] as string;
    if (!userId) {
      throw new ForbiddenException('Usuário não permitido');
    }
    return userId;
  },
);

export const IsAdminDecorator = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): boolean => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request) {
      throw new Error('Must eauth');
    }
    return request.role === UserRole.ADMIN;
  },
);
