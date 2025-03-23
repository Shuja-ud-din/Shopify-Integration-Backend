import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosInstance } from 'axios';
import { Model } from 'mongoose';
import { ShopifyRequiredScopes } from 'src/common/constants/shopifyScopes';
import {
  IGetProductsResponse,
  IShopifyProduct,
  IShopifyProductUpdate,
} from 'src/common/types/product.types';
import {
  IShopifyAccessScopeResponse,
  IShopifyStoreInfo,
  IShopifyStoreInfoResponse,
} from 'src/common/types/shopify.types';

import { IntegrateStoreDto } from './dtos/integrate-store.dto';
import { IShopifyStoreDoc, ShopifyStore } from './entities/shopifyStore.entity';

@Injectable()
export class ShopifyService {
  private axiosInstance: AxiosInstance;

  constructor(
    @InjectModel(ShopifyStore.name)
    private shopifyStoreModel: Model<IShopifyStoreDoc>,
  ) {}

  private async getShopifyBaseUrl(id: string): Promise<string> {
    const store = await this.shopifyStoreModel.findById(id);

    if (!store) {
      throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
    }

    return `${store.url}/admin/api/2023-01`;
  }

  private async getStoreInfo(
    payload: IntegrateStoreDto,
  ): Promise<IShopifyStoreInfo> {
    const { url, accessToken } = payload;

    try {
      const { data } = await this.axiosInstance.get<IShopifyStoreInfoResponse>(
        `${url}/admin/api/2023-01/shop.json`,
        {
          headers: {
            'X-Shopify-Access-Token': accessToken,
          },
        },
      );

      return data.shop;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to integrate with Shopify store',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async checkPermissions(payload: IntegrateStoreDto): Promise<boolean> {
    const { url, accessToken } = payload;

    try {
      const urlExists = await this.shopifyStoreModel.findOne({ url });

      if (urlExists) {
        throw new HttpException(
          'Store already integrated',
          HttpStatus.BAD_REQUEST,
        );
      }

      const { data } =
        await this.axiosInstance.get<IShopifyAccessScopeResponse>(
          `${url}/admin/api/2024-01/access_scopes.json`,
          {
            headers: {
              'X-Shopify-Access-Token': accessToken,
            },
          },
        );

      const { access_scopes } = data;

      const missingScopes = ShopifyRequiredScopes.filter(
        (scope) => !access_scopes.find((s) => s.handle === scope),
      );

      if (missingScopes.length) {
        console.error('Missing required permissions:', missingScopes);

        throw new HttpException(
          'Missing required permissions',
          HttpStatus.BAD_REQUEST,
        );
      }

      return true;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Invalid Shopify access token',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async integrateStore(payload: IntegrateStoreDto) {
    try {
      const [storeInfo, hasPermissions] = await Promise.all([
        this.getStoreInfo(payload),
        this.checkPermissions(payload),
      ]);

      if (!hasPermissions) {
        throw new HttpException(
          'Missing required permissions',
          HttpStatus.BAD_REQUEST,
        );
      }

      const store = new this.shopifyStoreModel({
        ...storeInfo,
        ...payload,
      });

      await store.save();

      return store;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to integrate with Shopify store',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async getProductsCount(storeId: string): Promise<number> {
    const url = await this.getShopifyBaseUrl(storeId);

    const { data } = await this.axiosInstance.get(`${url}/products/count.json`);

    return data.count;
  }

  async getStoreById(id: string): Promise<IShopifyStoreDoc> {
    const store = await this.shopifyStoreModel.findById(id);

    if (!store) {
      throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
    }

    return store;
  }

  async getProducts(storeId: string): Promise<IShopifyProduct[]> {
    const baseUrl = await this.getShopifyBaseUrl(storeId);
    const count = await this.getProductsCount(storeId);

    const limit = 250;
    const pages = Math.ceil(count / limit);
    const products: IShopifyProduct[] = [];
    let page_info = '';

    try {
      for (let i = 1; i <= pages; i++) {
        const url = `${baseUrl}/products.json`;

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

  async getProduct(storeId: string, id: number): Promise<IShopifyProduct> {
    const baseUrl = await this.getShopifyBaseUrl(storeId);
    const { data } = await this.axiosInstance.get(
      `${baseUrl}/products/${id}.json`,
    );

    return data.product;
  }

  async updateInventory(
    inventoryItemId: number,
    available: number,
    locationId: number,
  ): Promise<void> {
    try {
      await this.axiosInstance.post(`/inventory_levels/set.json`, {
        location_id: locationId,
        inventory_item_id: inventoryItemId,
        available: available,
      });
      console.log('Inventory updated successfully');
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  }

  async updateProduct(
    storeId: string,
    payload: IShopifyProductUpdate,
  ): Promise<IShopifyProduct> {
    const { productId, variantId, ...rest } = payload;

    const url = await this.getShopifyBaseUrl(storeId);

    try {
      const { data } = await this.axiosInstance.put(
        `${url}/variants/${variantId}.json`,
        {
          variant: rest,
        },
      );

      return data;
    } catch (error) {
      console.error(error);
      // throw new HttpException(
      //   'Failed to update product on Shopify',
      //   HttpStatus.BAD_REQUEST,
      // );
    }
  }
}
