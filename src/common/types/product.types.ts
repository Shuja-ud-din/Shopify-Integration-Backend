import mongoose from 'mongoose';
import { IProductDoc } from 'src/modules/product/entities/product.entity';

import { ShopifyProductStatus } from '../enums/product.enum';
import { ISchedule } from './schedule.types';
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
  cost: number;
  compareAtPrice: number;
  comparePriceFormula?: IFormula | mongoose.Types.ObjectId | null;
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
  formula: IFormula | mongoose.Types.ObjectId;

  schedule: ISchedule | null;
  isScheduled: boolean;

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

export interface IFormula {
  name: string;
  description: string;
  formula: string;
  store: mongoose.Types.ObjectId | IShopifyStore;
  createdAt: Date;
  updatedAt: Date;
}
