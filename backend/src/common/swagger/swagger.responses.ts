import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { COMMON_ERRORS, SWAGGER } from './swagger.constants';

/**
 * Common "success" response wrappers
 */
export function Ok<TModel extends Type<any>>(model?: TModel, description: string = 'OK') {
  return applyDecorators(
    ApiOkResponse(
      model
        ? { description, type: model }
        : { description },
    ),
  );
}

export function Created<TModel extends Type<any>>(model?: TModel, description: string = 'Created') {
  return applyDecorators(
    ApiCreatedResponse(
      model
        ? { description, type: model }
        : { description },
    ),
  );
}

/**
 * Common error response wrappers
 * IMPORTANT: description is typed as `string` so you can override freely.
 */
export function BadRequest(description: string = COMMON_ERRORS.BAD_REQUEST) {
  return applyDecorators(ApiBadRequestResponse({ description }));
}

export function Unauthorized(description: string = COMMON_ERRORS.UNAUTHORIZED) {
  return applyDecorators(ApiUnauthorizedResponse({ description }));
}

export function Forbidden(description: string = COMMON_ERRORS.FORBIDDEN) {
  return applyDecorators(ApiForbiddenResponse({ description }));
}

export function NotFound(description: string = COMMON_ERRORS.NOT_FOUND) {
  return applyDecorators(ApiNotFoundResponse({ description }));
}

export function Conflict(description: string = COMMON_ERRORS.CONFLICT) {
  return applyDecorators(ApiConflictResponse({ description }));
}

/**
 * Auth scheme decorator (+ baseline auth errors)
 * Use this on protected endpoints.
 */
export function AccessAuth() {
  return applyDecorators(
    ApiBearerAuth(SWAGGER.AUTH_SCHEMES.ACCESS_TOKEN),
    Unauthorized(),
    Forbidden(),
  );
}
