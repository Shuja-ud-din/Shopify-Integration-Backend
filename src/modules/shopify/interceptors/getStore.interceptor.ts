import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IShopifyStoreDoc } from '../entities/shopifyStore.entity';

@Injectable()
export class GetStoreInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data: IShopifyStoreDoc) => {
        return {
          statusCode,
          message: 'Shopify stores fetched successfully',
          store: {
            id: data._id,
            name: data.name,
            url: data.url,
          },
          success: true,
        };
      }),
    );
  }
}
