import { ConflictException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../repository/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async ensureUniqueOrThrow(email: string, username: string) {
    const [e, u] = await Promise.all([
      this.usersRepo.findByEmail(email),
      this.usersRepo.findByUsername(username),
    ]);
    if (e) throw new ConflictException('Email already in use');
    if (u) throw new ConflictException('Username already in use');
  }
}
