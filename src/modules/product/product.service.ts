import { Injectable } from '@nestjs/common';
import { ShopifyService } from '../shopify/shopify.service';

@Injectable()
export class ProductService {
  constructor(private readonly shopifyService: ShopifyService) {}
  async test() {
    return 'test';
  }

  async getShopifyProducts() {
    const products = await this.shopifyService.getProducts();
    return products;
  }
}
