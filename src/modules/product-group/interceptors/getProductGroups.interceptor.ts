import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IProductGroupDoc } from '../entities/product-group.entity';

@Injectable()
export class GetProductGroupsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data: IProductGroupDoc[]) => {
        return {
          statusCode,
          message: 'Product groups fetched successfully',
          productGroups: data.map((productGroup) => ({
            id: productGroup._id,
            name: productGroup.name,
            description: productGroup.description,
            tags: productGroup.tags,
            products: productGroup.products.map((product) => ({
              id: product._id,
              title: product.title,
              description: product.description,
              price: product.price,
              inventoryQuantity: product.inventoryQuantity,
              scrapperUrls: product.scrapperUrls,
              tags: product.tags,
              image: product.image,
              createdAt: product.createdAt,
              updatedAt: product.updatedAt,
            })),
            createdAt: productGroup.createdAt,
            updatedAt: productGroup.updatedAt,
          })),
          success: true,
        };
      }),
    );
  }
}
