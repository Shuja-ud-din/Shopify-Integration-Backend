import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ITagDoc } from '../entities/tag.entity';

@Injectable()
export class GetTagsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data: ITagDoc[]) => {
        return {
          statusCode,
          message: 'Tags fetched successfully',
          tags: data.map((tag) => ({
            id: tag._id,
            name: tag.name,
          })),
          success: true,
        };
      }),
    );
  }
}
