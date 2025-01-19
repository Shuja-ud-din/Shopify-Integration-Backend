import { Injectable } from '@nestjs/common';

@Injectable()
export class ShopifyService {
  constructor() {}

  private getShopifyBaseUrl(): string {
    const { SHOPIFY_API_KEY, SHOPIFY_PASSWORD, SHOPIFY_STORE } = process.env;
    return `https://${SHOPIFY_API_KEY}:${SHOPIFY_PASSWORD}@${SHOPIFY_STORE}/admin/api/2021-01`;
  }

  async getProducts(): Promise<any> {
    const url = this.getShopifyBaseUrl();
    const response = await fetch(`${url}/products.json`);
    return response.json();
  }

  async getProduct(id: string): Promise<any> {
    const url = this.getShopifyBaseUrl();
    const response = await fetch(`${url}/products/${id}.json`);
    return response.json();
  }
}
