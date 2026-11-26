import { Injectable } from '@nestjs/common';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

export interface TokenPayload extends JwtPayload {
  sub: string;
}

@Injectable()
export default class Token {
  private readonly secret = process.env.JWT_SECRET!;
  constructor() {
    if (!this.secret) {
      throw new Error('JWT secret is required');
    }
  }

  generate(
    dto: TokenPayload,
    expiresIn: SignOptions['expiresIn'] = '15m',
  ): string {
    return jwt.sign(dto, this.secret, { expiresIn });
  }

  verify(token: string): boolean {
    try {
      jwt.verify(token, this.secret);
      return true;
    } catch {
      return false;
    }
  }

  decode(token: string): TokenPayload | null {
    try {
      const payload = jwt.verify(token, this.secret);

      if (typeof payload === 'string') {
        return null;
      }

      return payload as TokenPayload;
    } catch {
      return null;
    }
  }
}
