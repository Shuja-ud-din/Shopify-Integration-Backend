import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IFormulaDoc } from '../entities/formula.entity';

@Injectable()
export class GetFormulaInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data: IFormulaDoc) => {
        return {
          statusCode,
          message: 'Formula fetched successfully',
          formula: {
            id: data._id,
            name: data.name,
            description: data.description,
            formula: data.formula,
            store: data.store,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          },
          success: true,
        };
      }),
    );
  }
}
