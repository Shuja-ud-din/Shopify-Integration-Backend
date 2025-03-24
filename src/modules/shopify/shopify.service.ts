import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';
import { Model } from 'mongoose';
import { ShopifyRequiredScopes } from 'src/common/constants/shopifyScopes';
import { IGetProductsResponse } from 'src/common/types/product.types';
import {
  IShopifyAccessScopeResponse,
  IShopifyInventoryUpdate,
  IShopifyProduct,
  IShopifyProductUpdate,
  IShopifyStoreInfo,
  IShopifyStoreInfoResponse,
  IShopifyStoreLocation,
  IShopifyStoreLocationsResponse,
} from 'src/common/types/shopify.types';

import { User } from '../user/entities/user.entity';
import { IntegrateStoreDto } from './dtos/integrate-store.dto';
import { IShopifyStoreDoc, ShopifyStore } from './entities/shopifyStore.entity';

@Injectable()
export class ShopifyService {
  private axiosInstance: AxiosInstance;

  constructor(
    @InjectModel(ShopifyStore.name)
    private shopifyStoreModel: Model<IShopifyStoreDoc>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    this.axiosInstance = axios.create();
  }

  private async getAxiosInstance(id: string): Promise<AxiosInstance> {
    const store = await this.shopifyStoreModel.findById(id);

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return axios.create({
      baseURL: `${store.url}/admin/api/2023-01`,
      headers: {
        'X-Shopify-Access-Token': store.accessToken,
      },
    });
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
        error.message || 'Something went wrong',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async checkPermissions(payload: IntegrateStoreDto): Promise<boolean> {
    const { url, accessToken } = payload;

    const urlExists = await this.shopifyStoreModel.findOne({ url });

    if (urlExists) {
      throw new HttpException(
        'Store already integrated',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { data } = await this.axiosInstance.get<IShopifyAccessScopeResponse>(
      `${url}/admin/oauth/access_scopes.json`,
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
  }

  async integrateStore(payload: IntegrateStoreDto, userId: string) {
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
        userId,
        url: payload.url.replace(/\/$/, ''),
      });

      await store.save();

      const user = await this.userModel.findById(userId);
      user.shopifyStores.push(store.id);
      await user.save();

      return store;
    } catch (error) {
      console.error(error);
      if (error.status === HttpStatus.UNAUTHORIZED) {
        throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(
          error.message || 'Something went wrong',
          error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  private async getProductsCount(storeId: string): Promise<number> {
    const shopifyApi = await this.getAxiosInstance(storeId);
    const { data } = await shopifyApi.get('/products/count.json');

    return data.count;
  }

  async getStoreById(id: string): Promise<IShopifyStoreDoc> {
    const store = await this.shopifyStoreModel.findById(id);

    if (!store) {
      throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
    }

    return store;
  }

  async getStoreLocations(storeId: string): Promise<IShopifyStoreLocation[]> {
    const shopifyApi = await this.getAxiosInstance(storeId);
    const { data } =
      await shopifyApi.get<IShopifyStoreLocationsResponse>('/locations.json');

    return data.locations;
  }

  async getProducts(storeId: string): Promise<IShopifyProduct[]> {
    const shopifyApi = await this.getAxiosInstance(storeId);
    const count = await this.getProductsCount(storeId);

    const limit = 250;
    const pages = Math.ceil(count / limit);
    const products: IShopifyProduct[] = [];
    let page_info = '';

    try {
      for (let i = 1; i <= pages; i++) {
        const { data, headers } = await shopifyApi.get<IGetProductsResponse>(
          '/products.json',
          {
            params: {
              limit,
              page_info,
            },
          },
        );

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
        error.message || 'Something went wrong',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProduct(storeId: string, id: number): Promise<IShopifyProduct> {
    const shopifyApi = await this.getAxiosInstance(storeId);
    const { data } = await shopifyApi.get(`/products/${id}.json`);

    return data.product;
  }

  async updateProduct(
    storeId: string,
    payload: IShopifyProductUpdate,
  ): Promise<IShopifyProduct> {
    const { productId, inventoryItemId, variantId, ...rest } = payload;

    const shopifyApi = await this.getAxiosInstance(storeId);

    try {
      const { data } = await shopifyApi.put(`/variants/${variantId}.json`, {
        variant: rest,
      });

      await this.updateProductInventory({
        inventoryItemId,
        available: rest.inventory_quantity,
        locationId: rest.locationId,
        storeId,
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
    inventoryItemId,
    available,
    locationId,
    storeId,
  }: IShopifyInventoryUpdate): Promise<void> {
    try {
      const shopifyApi = await this.getAxiosInstance(storeId);

      await shopifyApi.post(`/inventory_levels/set.json`, {
        location_id: locationId,
        inventory_item_id: inventoryItemId,
        available: available,
      });
      console.log('Inventory updated successfully');
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  }

  async getStores(userId: string): Promise<IShopifyStoreDoc[]> {
    const stores = await this.shopifyStoreModel.find({ userId });

    return stores;
  }
}
