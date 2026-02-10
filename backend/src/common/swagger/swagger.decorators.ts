import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { SWAGGER } from './swagger.constants';
import { AccessAuth } from './swagger.responses';

export function Tag(tag: string) {
  return applyDecorators(ApiTags(tag));
}

/**
 * Use on protected routes (requires access token).
 * Adds bearer auth + standard 401/403 responses.
 */
export function Protected() {
  return applyDecorators(AccessAuth());
}

/**
 * If you want Swagger to know about extra DTO models referenced indirectly.
 * Usually optional, but handy for shared error models / unions.
 */
export function ExtraModels(...models: Type<unknown>[]) {
  return applyDecorators(ApiExtraModels(...models));
}

/**
 * Convenience tag helpers.
 */
export function AuthTag() {
  return Tag(SWAGGER.TAGS.AUTH);
}

export function UsersTag() {
  return Tag(SWAGGER.TAGS.USERS);
}
