import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';

type WithMeta = { data: any; meta?: any; message?: string };

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const res = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((payload: any) => {
        // allow returning { data, meta, message } from endpoints
        if (payload && typeof payload === 'object' && 'data' in payload) {
          const p = payload as WithMeta;
          return {
            statusCode: res.statusCode,
            message: p.message ?? 'Success',
            data: p.data,
            ...(p.meta ? { meta: p.meta } : {}),
          };
        }

        // normal return (data only)
        return {
          statusCode: res.statusCode,
          message: 'Success',
          data: payload,
        };
      }),
    );
  }
}
