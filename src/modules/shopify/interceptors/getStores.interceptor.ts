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
export class GetStoresInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data: IShopifyStoreDoc[]) => {
        return {
          statusCode,
          message: 'Shopify stores fetched successfully',
          stores: data.map((store) => ({
            id: store._id,
            name: store.name,
            url: store.url,
          })),
          success: true,
        };
      }),
    );
  }
}
