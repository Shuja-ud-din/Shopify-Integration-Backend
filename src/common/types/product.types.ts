import mongoose from 'mongoose';
import { IProductDoc } from 'src/modules/product/entities/product.entity';

import { ShopifyProductStatus } from '../enums/product.enum';
import { IShopifyProduct } from './shopify.types';
import { IShopifyStore, IUser } from './user.types';

export interface IProduct {
  shopifyProductId: number;
  shopifyVariantId: number;
  title: string;
  bodyHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  status: ShopifyProductStatus;
  image: string;
  sku: string;
  price: number;
  inventoryQuantity: number;
  profitMargin?: number;
  scrapperUrls: string[];
  hasChanges: boolean;
  available: boolean;
  shopifyUpdateBlocked: boolean;
  locationId: number;
  fallbackInventoryQuantity: number;
  store: mongoose.Types.ObjectId | IShopifyStore;
  inventoryItemId: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface ITag {
  name: string;
  store: mongoose.Types.ObjectId | IShopifyStore;
}

export interface IProductGroup {
  name: string;
  description: string;
  tags: string[];
  products: IProductDoc[] | mongoose.Types.ObjectId[];
  isScraping: boolean;
  store: mongoose.Types.ObjectId | IShopifyStore;
  user: mongoose.Types.ObjectId | IUser;
  formula: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface IGetProductsResponse {
  products: IShopifyProduct[];
}

export interface IScrapperPayloadProduct {
  url: string;
  id: string;
}

export interface IScapedProduct {
  id: string;
  url: string;
  title: string;
  price: number;
  stockQty: number;
  available: boolean;
  imageUrl: string;
}
