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
