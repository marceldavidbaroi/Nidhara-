import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@/modules/users/users.module';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';
import { AuthRepository } from './repository/auth.repository';
import { AuthTokensService } from './services/auth.tokens';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({}), // we pass secrets per-sign call
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, AuthTokensService],
})
export class AuthModule {}
