import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

@Injectable()
export class AuthTokensService {
  constructor(private readonly jwt: JwtService) {}

  randomToken(bytes = 32) {
    return crypto.randomBytes(bytes).toString('hex');
  }

  signAccess(payload: { sub: string; sessionId: string }) {
    return this.jwt.signAsync(payload, { secret: process.env.JWT_ACCESS_SECRET });
  }

  signRefresh(payload: { sub: string; sessionId: string }) {
    return this.jwt.signAsync(payload, { secret: process.env.JWT_REFRESH_SECRET });
  }

  verifyRefresh(token: string) {
    return this.jwt.verifyAsync(token, { secret: process.env.JWT_REFRESH_SECRET });
  }
}
