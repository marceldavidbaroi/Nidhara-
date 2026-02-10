import { Module } from '@nestjs/common';
import { UsersRepository } from './repository/users.repository';
import { UsersService } from './services/users.service';

@Module({
  providers: [UsersRepository, UsersService],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}
