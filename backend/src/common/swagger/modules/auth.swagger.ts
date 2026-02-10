import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthTag } from '../swagger.decorators';
import { BadRequest, Conflict, Created, Forbidden, Ok, Unauthorized } from '../swagger.responses';

// If you have response DTOs, import them here (recommended)
// import { AuthResponseDto } from '@/modules/auth/dto/auth.response.dto';

export function AuthControllerDocs() {
  return applyDecorators(AuthTag());
}

export function SignupDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create account' }),
    // Created(AuthResponseDto, 'User created and logged in'),
    Created(undefined, 'User created and logged in'),
    BadRequest(),
    Conflict('Email or username already in use'),
  );
}

export function SigninDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Sign in' }),
    // Ok(AuthResponseDto, 'Signed in'),
    Ok(undefined, 'Signed in'),
    BadRequest(),
    Unauthorized('Invalid credentials'),
  );
}

export function RefreshDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Refresh access token (rotates refresh token)' }),
    // Ok(AuthResponseDto, 'Tokens refreshed'),
    Ok(undefined, 'Tokens refreshed'),
    BadRequest(),
    Unauthorized('Missing/invalid refresh token'),
    Forbidden('Session revoked/expired or CSRF mismatch'),
  );
}

export function LogoutDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Logout (revoke current session)' }),
    Ok(undefined, 'Logged out'),
  );
}
