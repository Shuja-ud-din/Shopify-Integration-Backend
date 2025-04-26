import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IProductDoc } from '../entities/product.entity';

@Injectable()
export class GetProductsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => {
        return {
          statusCode,
          message: 'Products fetched successfully',
          products: data.map((product: IProductDoc) => {
            return {
              id: product._id,
              title: product.title,
              price: product.price,
              compareAtPrice: product.compareAtPrice,
              tags: product.tags,
              sku: product.sku,
              image: product.image,
              profitMargin: product.profitMargin,
              available: product.available,
              fallbackInventoryQuantity: product.fallbackInventoryQuantity,
              createdAt: product.createdAt,
              updatedAt: product.updatedAt,
              inventoryQuantity: product.inventoryQuantity,
              productType: product.productType,
              scrapperUrls: product.scrapperUrls,
              shopifyProductId: product.shopifyProductId,
              status: product.status,
              shopifyUpdateBlocked: product.shopifyUpdateBlocked,
              hasChanges: product.hasChanges,
              vendor: product.vendor,
            };
          }),
          success: true,
        };
      }),
    );
  }
}
