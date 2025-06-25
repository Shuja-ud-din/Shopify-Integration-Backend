import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IFormulaDoc } from '@/modules/formula/entities/formula.entity';

import { IProductGroupDoc } from '../entities/product-group.entity';

@Injectable()
export class GetProductGroupInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((productGroup: IProductGroupDoc) => {
        const formula = productGroup.formula as IFormulaDoc;
        return {
          statusCode,
          message: 'Product group fetched successfully',
          productGroup: {
            id: productGroup._id,
            name: productGroup.name,
            description: productGroup.description,
            formula: {
              id: formula?._id,
              name: formula?.name,
              description: formula?.description,
              formula: formula?.formula,
            },
            tags: productGroup.tags,
            isScraping: productGroup.isScraping,
            isScheduled: productGroup.isScheduled,
            schedule: productGroup.schedule,
            products: productGroup.products.map((product) => ({
              id: product._id,
              title: product.title,
              price: product.price,
              compareAtPrice: product.compareAtPrice,
              comparePriceFormula: product.comparePriceFormula,
              tags: product.tags,
              sku: product.sku,
              bodyHtml: product.bodyHtml,
              image: product.image,
              createdAt: product.createdAt,
              updatedAt: product.updatedAt,
              profitMargin: product.profitMargin,
              inventoryQuantity: product.inventoryQuantity,
              available: product.available,
              fallbackInventoryQuantity: product.fallbackInventoryQuantity,
              locationId: product.locationId,
              productType: product.productType,
              scrapperUrls: product.scrapperUrls,
              shopifyProductId: product.shopifyProductId,
              shopifyUpdateBlocked: product.shopifyUpdateBlocked,
              hasChanges: product.hasChanges,
              status: product.status,
              vendor: product.vendor,
            })),
            createdAt: productGroup.createdAt,
            updatedAt: productGroup.updatedAt,
          },
          success: true,
        };
      }),
    );
  }
}
