import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import {
  IGetProductsResponse,
  IShopifyProduct,
} from 'src/common/types/product.types';

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

  async getProductsCount(): Promise<number> {
    const { data } = await this.axiosInstance.get(
      `${this.shopifyBaseUrl}/products/count.json`,
    );

    return data.count;
  }

  async getProducts(): Promise<IShopifyProduct[]> {
    let nextPageInfo = null;
    const count = await this.getProductsCount();
    const limit = 250;
    const pages = Math.ceil(count / limit);
    const products: IShopifyProduct[] = [];

    try {
      for (let i = 1; i <= pages; i++) {
        const url = new URL(`${this.shopifyBaseUrl}/products.json`);
        url.searchParams.append('limit', limit.toString());
        if (nextPageInfo) {
          url.searchParams.append('page_info', nextPageInfo);
        }

        const { data, headers } =
          await this.axiosInstance.get<IGetProductsResponse>(url.toString());

        products.push(...data.products);

        const linkHeader = headers['link'];
        if (linkHeader) {
          const nextLink = linkHeader
            .split(',')
            .find((link: string) => link.includes('rel="next"'));
          if (nextLink) {
            nextPageInfo = new URLSearchParams(
              nextLink.match(/<([^>]+)>/)[1],
            ).get('page_info');
          } else {
            nextPageInfo = null;
          }
        } else {
          nextPageInfo = null;
        }
      }

      return products;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to fetch all products from Shopify',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getProduct(id: string): Promise<IShopifyProduct> {
    const { data } = await this.axiosInstance.get(`products/${id}.json`);

    return data;
  }
}
