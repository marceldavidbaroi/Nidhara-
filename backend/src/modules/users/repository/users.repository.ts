import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  findById(id: bigint) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  create(data: { username: string; email: string; displayName?: string | null }) {
    return this.prisma.user.create({ data });
  }
}
