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
