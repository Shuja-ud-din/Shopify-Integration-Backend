import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import {
  IGetProductsResponse,
  IShopifyInventoryUpdate,
  IShopifyProduct,
  IShopifyProductUpdate,
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
    const count = await this.getProductsCount();

    console.log('Total products:', count);

    const limit = 250;
    const pages = Math.ceil(count / limit);
    const products: IShopifyProduct[] = [];
    let page_info = '';

    try {
      for (let i = 1; i <= pages; i++) {
        const url = `${this.shopifyBaseUrl}/products.json`;

        const { data, headers } =
          await this.axiosInstance.get<IGetProductsResponse>(url, {
            params: {
              limit,
              page_info,
            },
          });

        if (headers.link) {
          page_info = headers.link?.match(/page_info=([^&>]+)/)?.[1];
        }

        products.push(...data.products);
      }

      console.log('Fetched products:', products.length);

      return products;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to fetch all products from Shopify',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getProduct(id: number): Promise<IShopifyProduct> {
    const { data } = await this.axiosInstance.get(`products/${id}.json`);

    return data.product;
  }

  async updateProduct(
    payload: IShopifyProductUpdate,
  ): Promise<IShopifyProduct> {
    const { productId, variantId, ...rest } = payload;
    try {
      const { data } = await this.axiosInstance.put(
        `variants/${variantId}.json`,
        {
          variant: rest,
        },
      );

      await this.updateProductInventory({
        variantId,
        available: rest.inventory_quantity,
        locationId: rest.locationId,
      });

      return data;
    } catch (error) {
      console.error(error);
      // throw new HttpException(
      //   'Failed to update product on Shopify',
      //   HttpStatus.BAD_REQUEST,
      // );
    }
  }

  private async updateProductInventory({
    variantId,
    available,
    locationId,
  }: IShopifyInventoryUpdate): Promise<void> {
    try {
      await this.axiosInstance.post(`/inventory_levels/set.json`, {
        location_id: locationId,
        inventory_item_id: variantId,
        available: available,
      });
      console.log('Inventory updated successfully');
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  }
}
