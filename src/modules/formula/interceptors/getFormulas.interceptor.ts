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
export class GetFormulasInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data: IFormulaDoc[]) => {
        return {
          statusCode,
          message: 'Formulas fetched successfully',
          formulas: data.map((formula) => ({
            id: formula._id,
            name: formula.name,
            description: formula.description,
            formula: formula.formula,
            store: formula.store,
            createdAt: formula.createdAt,
            updatedAt: formula.updatedAt,
          })),
          success: true,
        };
      }),
    );
  }
}
