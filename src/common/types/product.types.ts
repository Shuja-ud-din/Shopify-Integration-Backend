import mongoose from 'mongoose';
import { IProductDoc } from 'src/modules/product/entities/product.entity';

import { ShopifyProductStatus } from '../enums/product.enum';
import { IShopifyStore, IUser } from './user.types';

interface IShopifyVariant {
  id: number;
  product_id: number;
  title: string;
  price: string;
  position: number;
  sku: string;
  created_at: string;
  updated_at: string;
  taxable: boolean;
  inventory_quantity: number;
  image_id: number;
}

interface IShopifyOption {
  id: number;
  product_id: number;
  name: string;
  position: number;
  values: string[];
}

interface IShopifyImage {
  id: number;
  alt: string;
  position: number;
  product_id: number;
  created_at: string;
  updated_at: string;
  width: number;
  height: number;
  src: string;
  variant_ids: number[];
}

export interface IShopifyProduct {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  created_at: string;
  handle: string;
  updated_at: string;
  published_at: string;
  template_suffix: string;
  published_scope: string;
  tags: string;
  status: ShopifyProductStatus;
  variants: IShopifyVariant[];
  options: IShopifyOption[];
  images: IShopifyImage[];
  image: IShopifyImage;
}

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

  createdAt: Date;
  updatedAt: Date;
}

export interface ITag {
  name: string;
}

export interface IProductGroup {
  name: string;
  description: string;
  tags: string[];
  products: IProductDoc[] | mongoose.Types.ObjectId[];
  isScraping: boolean;
  store: mongoose.Types.ObjectId | IShopifyStore;
  user: mongoose.Types.ObjectId | IUser;

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

export interface IShopifyProductUpdate {
  productId: number;
  variantId: number;
  locationId: number;

  price: number;
  inventory_quantity?: number;
}

export interface IShopifyInventoryUpdate {
  variantId: number;
  available: number;
  locationId: number;
}
