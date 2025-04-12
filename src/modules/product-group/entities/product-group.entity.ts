import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';
import { EndScheduleOn, RepeatUnit } from 'src/common/enums/schedule.enum';
import { IProductGroup } from 'src/common/types/product.types';
import {
  IShopifyStoreDoc,
  ShopifyStore,
} from 'src/modules/shopify/entities/shopifyStore.entity';
import { IUserDoc, User } from 'src/modules/user/entities/user.entity';

export type IProductGroupDoc = IProductGroup & Document;

@Schema()
export class ProductGroup implements IProductGroup {
  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: [] })
  tags: string[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    default: [],
  })
  products: mongoose.Types.ObjectId[];

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: ShopifyStore.name,
    required: true,
  })
  store: mongoose.Types.ObjectId | IShopifyStoreDoc;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
  user: mongoose.Types.ObjectId | IUserDoc;

  @Prop({ default: '' })
  formula: string;

  @Prop({ default: false })
  isScraping: boolean;

  @Prop({ default: false })
  isScheduled: boolean;

  @Prop({ default: null, type: Object })
  schedule: {
    startDate: string;
    startTime: string;
    timezone: string;
    repeat: {
      every: number;
      unit: RepeatUnit;
    };
    end: {
      on: EndScheduleOn;
      value: number;
    };
    runCount: number;
  } | null;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;
}

export const ProductGroupSchema = SchemaFactory.createForClass(ProductGroup);
