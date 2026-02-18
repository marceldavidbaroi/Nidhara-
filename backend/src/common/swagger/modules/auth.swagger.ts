import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

import { AuthTag } from '../swagger.decorators';
import { BadRequest, Conflict, Created, Forbidden, Ok, Unauthorized } from '../swagger.responses';

import { SignupDto } from '@/modules/auth/dto/signup.dto';
import { SigninDto } from '@/modules/auth/dto/signin.dto';
import { RefreshDto } from '@/modules/auth/dto/refresh.dto';

import { AuthTokensResponseDto, OkResponseDto } from '@/modules/auth/dto/auth.response.dto';

export function AuthControllerDocs() {
  return applyDecorators(AuthTag());
}

export function SignupDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create account' }),

    ApiBody({
      type: SignupDto,
      examples: {
        default: {
          value: {
            username: 'john_doe',
            email: 'user@example.com',
            displayName: 'John Doe',
            password: 'Password@123',
          },
        },
      },
    }),

    Created(AuthTokensResponseDto, 'User created and logged in'),
    BadRequest(),
    Conflict('Email or username already in use'),
  );
}

export function SigninDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Sign in' }),

    ApiBody({
      type: SigninDto,
      examples: {
        default: {
          value: {
            email: 'user@example.com',
            password: 'Password@123',
            deviceName: 'chrome',
          },
        },
      },
    }),

    Ok(AuthTokensResponseDto, 'Signed in'),
    BadRequest(),
    Unauthorized('Invalid credentials'),
  );
}

export function RefreshDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Refresh access token (rotates refresh token)' }),

    ApiBody({
      type: RefreshDto,
      examples: {
        default: {
          value: {
            csrfToken: 'paste_csrf_token_from_signin_signup_response',
          },
        },
      },
    }),

    Ok(AuthTokensResponseDto, 'Tokens refreshed'),
    BadRequest(),
    Unauthorized('Missing/invalid refresh token'),
    Forbidden('Session revoked/expired or CSRF mismatch'),
  );
}

export function LogoutDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Logout (revoke current session)' }),
    Ok(OkResponseDto, 'Logged out'),
  );
}
