import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { ITag } from 'src/common/types/product.types';
import {
  IShopifyStoreDoc,
  ShopifyStore,
} from 'src/modules/shopify/entities/shopifyStore.entity';

@Schema()
export class Tag implements ITag {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: ShopifyStore.name,
    required: true,
  })
  store: mongoose.Types.ObjectId | IShopifyStoreDoc;
}

export type ITagDoc = HydratedDocument<Tag>;
export const TagSchema = SchemaFactory.createForClass(Tag);
