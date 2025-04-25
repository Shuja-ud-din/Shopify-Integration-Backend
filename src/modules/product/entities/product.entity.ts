import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { ShopifyProductStatus } from 'src/common/enums/product.enum';
import { IProduct } from 'src/common/types/product.types';
import {
  IShopifyStoreDoc,
  ShopifyStore,
} from 'src/modules/shopify/entities/shopifyStore.entity';

@Schema()
export class Product implements IProduct {
  @Prop()
  shopifyProductId: number;

  @Prop()
  shopifyVariantId: number;

  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  bodyHtml: string;

  @Prop({ default: '' })
  vendor: string;

  @Prop({ default: '' })
  productType: string;

  @Prop({ default: [] })
  tags: string[];

  @Prop({ default: ShopifyProductStatus.DRAFT })
  status: ShopifyProductStatus;

  @Prop({ default: '' })
  image: string;

  @Prop({ required: true })
  sku: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  compareAtPrice: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Formula', default: null })
  comparePriceFormula: Types.ObjectId | null;

  @Prop({ required: true, default: 0 })
  inventoryQuantity: number;

  @Prop({ default: 1 })
  profitMargin: number;

  @Prop({ default: [] })
  scrapperUrls: string[];

  @Prop({ default: false })
  hasChanges: boolean;

  @Prop({ default: false })
  available: boolean;

  @Prop({ default: false })
  shopifyUpdateBlocked: boolean;

  @Prop({ required: true })
  locationId: number;

  @Prop({ required: true })
  inventoryItemId: number;

  @Prop({ default: 5 })
  fallbackInventoryQuantity: number;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: ShopifyStore.name,
    required: true,
  })
  store: Types.ObjectId | IShopifyStoreDoc;

  @Prop({ required: true, default: Date.now() })
  createdAt: Date;

  @Prop({ required: true, default: Date.now() })
  updatedAt: Date;
}

export type IProductDoc = HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product);
