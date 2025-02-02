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
export class UpdateProductInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((product: IProductDoc) => {
        return {
          statusCode,
          message: 'Product updated successfully',
          product: {
            id: product._id,
            title: product.title,
            price: product.price,
            tags: product.tags,
            sku: product.sku,
            image: product.image,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            inventoryQuantity: product.inventoryQuantity,
            productType: product.productType,
            scrapperUrls: product.scrapperUrls,
            shopifyProductId: product.shopifyProductId,
            status: product.status,
            vendor: product.vendor,
          },
          success: true,
        };
      }),
    );
  }
}
