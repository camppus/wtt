/* eslint-disable @typescript-eslint/no-unused-vars */
import { ForbiddenException, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import Token from '@/infra/security/token';

export default class AuthMiddleare implements NestMiddleware {
  constructor(private readonly token: Token) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new ForbiddenException({
        message: 'authorization header não informado',
      });
    }

    const [type, token] = authHeader.split(' ');
    if (!token) {
      throw new ForbiddenException({
        message: 'Token não enviado',
      });
    }

    const isValid = this.token.verify(token);
    if (!isValid) {
      throw new Error('Token is not valid');
    }
    const decodedToken = this.token.decode(token)!;
    req.headers['x-user-id'] = decodedToken?.sub;
    next();
    return;
  }
}
