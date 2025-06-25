import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IFormulaDoc } from '@/modules/formula/entities/formula.entity';

import { IProductDoc } from '../entities/product.entity';

@Injectable()
export class GetProductInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((product: IProductDoc) => {
        const comparePriceFormula = product?.comparePriceFormula as IFormulaDoc;
        return {
          statusCode,
          message: 'Product Fetched successfully',
          product: {
            id: product._id,
            title: product.title,
            cost: product.cost,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            comparePriceFormula: comparePriceFormula
              ? {
                  id: comparePriceFormula.id,
                  name: comparePriceFormula.name,
                  description: comparePriceFormula.description,
                  formula: comparePriceFormula.formula,
                }
              : null,
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
          },
          success: true,
        };
      }),
    );
  }
}
