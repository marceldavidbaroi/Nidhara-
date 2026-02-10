import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { AuthCredentialType, SecurityEventType } from '@prisma/client';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  createPasswordCredential(userId: bigint, passwordHash: string) {
    return this.prisma.authCredential.create({
      data: {
        userId,
        type: AuthCredentialType.PASSWORD,
        secretHash: passwordHash,
        metadata: {},
      },
    });
  }

  findPasswordCredentialByUserId(userId: bigint) {
    return this.prisma.authCredential.findFirst({
      where: { userId, type: AuthCredentialType.PASSWORD },
    });
  }

  createSession(data: {
    userId: bigint;
    refreshTokenHash: string;
    csrfToken: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    deviceName?: string | null;
    expiresAt: Date;
  }) {
    return this.prisma.authSession.create({ data });
  }

  findSessionById(id: bigint) {
    return this.prisma.authSession.findUnique({ where: { id } });
  }

  revokeSession(sessionId: bigint) {
    return this.prisma.authSession.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }

  rotateRefresh(sessionId: bigint, newHash: string, newExpiresAt: Date) {
    return this.prisma.authSession.update({
      where: { id: sessionId },
      data: { refreshTokenHash: newHash, expiresAt: newExpiresAt },
    });
  }

  logEvent(type: SecurityEventType, userId?: bigint | null, metadata?: any) {
    return this.prisma.securityEvent.create({
      data: { type, userId: userId ?? null, metadata: metadata ?? {} },
    });
  }
}
