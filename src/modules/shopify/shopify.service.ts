import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class ShopifyService {
  private readonly shopifyBaseUrl: string;
  private readonly shopifyAccessToken: string;
  private readonly axiosInstance: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.shopifyBaseUrl = `https://${this.configService.get('shopify.store')}/admin/api/2023-01/`;
    this.shopifyAccessToken = this.configService.get('shopify.accessToken');
    this.axiosInstance = axios.create({
      baseURL: this.shopifyBaseUrl,
      headers: {
        'X-Shopify-Access-Token': this.shopifyAccessToken,
      },
    });
  }

  async getProducts(): Promise<any> {
    console.log({
      shopifyBaseUrl: this.shopifyBaseUrl,
      shopifyAccessToken: this.shopifyAccessToken,
    });

    const { data } = await this.axiosInstance.get('products.json');
    console.log(data);
    return data;
  }

  async getProduct(id: string): Promise<any> {
    const { data } = await this.axiosInstance.get(`products/${id}.json`);
    return data;
  }
}
