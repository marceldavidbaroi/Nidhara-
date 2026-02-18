import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';

import { AuthService } from '../services/auth.service';
import { SignupDto } from '../dto/signup.dto';
import { SigninDto } from '../dto/signin.dto';
import { RefreshDto } from '../dto/refresh.dto';

import {
  AuthControllerDocs,
  SignupDocs,
  SigninDocs,
  RefreshDocs,
  LogoutDocs,
} from '@/common/swagger/modules/auth.swagger';

import { toAuthTokensResponse } from '../transformers/auth.transformer';

function setRefreshCookie(res: Response, token: string) {
  res.cookie('refresh_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/auth',
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie('refresh_token', { path: '/auth' });
}

@AuthControllerDocs()
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('signup')
  @SignupDocs()
  async signup(@Body() dto: SignupDto, @Res({ passthrough: true }) res: Response) {
    const out = await this.auth.signup(dto);
    setRefreshCookie(res, out.refreshToken);
    return toAuthTokensResponse(out);
  }

  @Post('signin')
  @SigninDocs()
  async signin(@Body() dto: SigninDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const out = await this.auth.signin(dto, { ip: req.ip, ua: req.headers['user-agent'] });
    setRefreshCookie(res, out.refreshToken);
    return toAuthTokensResponse(out);
  }

  @Post('refresh')
  @RefreshDocs()
  async refresh(@Body() dto: RefreshDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refresh_token as string | undefined;
    const out = await this.auth.refresh(refreshToken, dto.csrfToken);
    setRefreshCookie(res, out.refreshToken);
    return toAuthTokensResponse(out);
  }

  @Post('logout')
  @LogoutDocs()
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refresh_token as string | undefined;
    await this.auth.logout(refreshToken);
    clearRefreshCookie(res);
    return { ok: true };
  }
}
