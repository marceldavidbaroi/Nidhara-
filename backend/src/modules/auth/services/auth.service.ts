import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { SecurityEventType } from '@prisma/client';

import { UsersRepository } from '@/modules/users/repository/users.repository';
import { UsersService } from '@/modules/users/services/users.service';

import { AuthRepository } from '../repository/auth.repository';
import { AuthTokensService } from './auth.tokens';

import { SignupDto } from '../dto/signup.dto';
import { SigninDto } from '../dto/signin.dto';

const accessTtlSeconds = Number(process.env.ACCESS_TOKEN_TTL_SECONDS ?? 900);
const refreshTtlDays = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? 30);

function refreshExpiryDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() + refreshTtlDays);
  return d;
}

export type AuthSessionOutput = {
  accessToken: string;
  refreshToken: string;
  csrfToken: string;
  sessionId: string;
  expiresIn: number;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly usersService: UsersService,
    private readonly authRepo: AuthRepository,
    private readonly tokens: AuthTokensService,
  ) {}

  async signup(input: SignupDto): Promise<AuthSessionOutput> {
    await this.usersService.ensureUniqueOrThrow(input.email, input.username);

    const user = await this.usersRepo.create({
      username: input.username,
      email: input.email,
      displayName: input.displayName,
    });

    const passwordHash = await argon2.hash(input.password);
    await this.authRepo.createPasswordCredential(user.id, passwordHash);

    // auto-login after signup
    return this.issueSession(user.id, { deviceName: 'signup' });
  }

  async signin(
    input: SigninDto,
    meta?: { ip?: string; ua?: string },
  ): Promise<AuthSessionOutput> {
    const user = await this.usersRepo.findByEmail(input.email);
    if (!user) {
      await this.authRepo.logEvent(SecurityEventType.LOGIN_FAILED, null, { reason: 'email_not_found' });
      throw new UnauthorizedException('Invalid credentials');
    }

    const cred = await this.authRepo.findPasswordCredentialByUserId(user.id);
    if (!cred) throw new BadRequestException('Password sign-in not enabled');

    const ok = await argon2.verify(cred.secretHash, input.password);
    if (!ok) {
      await this.authRepo.logEvent(SecurityEventType.LOGIN_FAILED, user.id, { reason: 'bad_password' });
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.authRepo.logEvent(SecurityEventType.LOGIN_SUCCESS, user.id, { deviceName: input.deviceName });

    return this.issueSession(user.id, {
      deviceName: input.deviceName,
      ipAddress: meta?.ip,
      userAgent: meta?.ua,
    });
  }

  private async issueSession(
    userId: bigint,
    meta?: { ipAddress?: string; userAgent?: string; deviceName?: string },
  ): Promise<AuthSessionOutput> {
    const csrfToken = this.tokens.randomToken(16);

    // create refresh jwt (we need session id, so create session first with placeholder then rotate)
    const tmpHash = await argon2.hash(this.tokens.randomToken(32));
    const session = await this.authRepo.createSession({
      userId,
      refreshTokenHash: tmpHash,
      csrfToken,
      ipAddress: meta?.ipAddress ?? null,
      userAgent: meta?.userAgent ?? null,
      deviceName: meta?.deviceName ?? null,
      expiresAt: refreshExpiryDate(),
    });

    const payload = { sub: userId.toString(), sessionId: session.id.toString() };
    const [accessToken, refreshToken] = await Promise.all([
      this.tokens.signAccess(payload),
      this.tokens.signRefresh(payload),
    ]);

    // store hash of refresh token
    const refreshHash = await argon2.hash(refreshToken);
    await this.authRepo.rotateRefresh(session.id, refreshHash, refreshExpiryDate());

    return {
      accessToken,
      refreshToken,
      csrfToken,
      sessionId: session.id.toString(),
      expiresIn: accessTtlSeconds,
    };
  }

  async refresh(refreshToken: string | undefined, csrfFromClient: string): Promise<Omit<AuthSessionOutput, 'sessionId'>> {
    if (!refreshToken) throw new UnauthorizedException('Missing refresh token');

    const decoded = await this.tokens.verifyRefresh(refreshToken).catch(() => null);
    if (!decoded?.sessionId || !decoded?.sub) throw new UnauthorizedException('Invalid refresh token');

    const sessionId = BigInt(decoded.sessionId);
    const userId = BigInt(decoded.sub);

    const session = await this.authRepo.findSessionById(sessionId);
    if (!session || session.revokedAt) throw new ForbiddenException('Session revoked');
    if (session.expiresAt < new Date()) throw new ForbiddenException('Session expired');
    if (session.userId !== userId) throw new ForbiddenException('Token mismatch');

    if (session.csrfToken !== csrfFromClient) throw new ForbiddenException('Bad CSRF token');

    const ok = await argon2.verify(session.refreshTokenHash, refreshToken);
    if (!ok) throw new ForbiddenException('Refresh token does not match');

    // rotate refresh
    const payload = { sub: userId.toString(), sessionId: sessionId.toString() };
    const [newAccess, newRefresh] = await Promise.all([
      this.tokens.signAccess(payload),
      this.tokens.signRefresh(payload),
    ]);

    const newHash = await argon2.hash(newRefresh);
    await this.authRepo.rotateRefresh(sessionId, newHash, refreshExpiryDate());
    await this.authRepo.logEvent(SecurityEventType.REFRESH_ROTATED, userId, { sessionId: sessionId.toString() });

    return {
      accessToken: newAccess,
      refreshToken: newRefresh,
      csrfToken: session.csrfToken,
      expiresIn: accessTtlSeconds,
    };
  }

  async logout(refreshToken: string | undefined): Promise<{ ok: true }> {
    if (!refreshToken) return { ok: true };

    const decoded = await this.tokens.verifyRefresh(refreshToken).catch(() => null);
    if (!decoded?.sessionId || !decoded?.sub) return { ok: true };

    const sessionId = BigInt(decoded.sessionId);
    const userId = BigInt(decoded.sub);

    const session = await this.authRepo.findSessionById(sessionId);
    if (session && !session.revokedAt) {
      await this.authRepo.revokeSession(sessionId);
      await this.authRepo.logEvent(SecurityEventType.LOGOUT, userId, { sessionId: sessionId.toString() });
    }

    return { ok: true };
  }
}
