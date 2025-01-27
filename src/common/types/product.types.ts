import { ObjectId } from 'mongoose';
import { IProductDoc } from 'src/modules/product/entities/product.entity';

import { ShopifyProductStatus } from '../enums/product.enum';

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

  scrapperUrls: string[];

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
  products: IProductDoc[] | ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

export interface IGetProductsResponse {
  products: IShopifyProduct[];
}
