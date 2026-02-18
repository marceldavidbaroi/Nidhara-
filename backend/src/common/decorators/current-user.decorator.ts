import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type CurrentUserData = {
  userId: bigint;
  sessionId: bigint;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserData => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
