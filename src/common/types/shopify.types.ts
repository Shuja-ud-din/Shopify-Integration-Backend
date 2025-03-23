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

export interface IShopifyStoreInfo {
  id: number;
  name: string;
  email: string;
  domain: string;
}

export interface IShopifyStoreInfoResponse {
  shop: IShopifyStoreInfo;
}

export interface IShopifyAccessScope {
  handle: string;
}

export interface IShopifyAccessScopeResponse {
  access_scopes: IShopifyAccessScope[];
}

export interface IShopifyStoreLocation {
  id: number;
  name: string;
  address1: string;
  address2: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  phone: string;
  created_at: string;
  updated_at: string;
  country_code: string;
  country_name: string;
  province_code: string;
  legacy: boolean;
  active: boolean;
  admin_graphql_api_id: string;
  localized_country_name: string;
  localized_province_name: string;
}

export interface IShopifyStoreLocationsResponse {
  locations: IShopifyStoreLocation[];
}
