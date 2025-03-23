import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { IShopifyStore } from 'src/common/types/user.types';
import { IUserDoc } from 'src/modules/user/entities/user.entity';

@Schema()
export class ShopifyStore implements IShopifyStore {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  accessToken: string;

  @Prop({ required: true })
  url: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId | IUserDoc;
}

export type IShopifyStoreDoc = HydratedDocument<ShopifyStore>;
export const ShopifyStoreSchema = SchemaFactory.createForClass(ShopifyStore);
