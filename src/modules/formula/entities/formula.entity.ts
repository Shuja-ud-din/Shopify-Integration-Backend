import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';
import { IFormula } from 'src/common/types/product.types';
import { ShopifyStore } from 'src/modules/shopify/entities/shopifyStore.entity';

@Schema()
export class Formula implements IFormula {
  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true })
  formula: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: ShopifyStore.name,
    required: true,
  })
  store: mongoose.Types.ObjectId | ShopifyStore;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;
}

export type IFormulaDoc = Formula & Document;
export const FormulaSchema = SchemaFactory.createForClass(Formula);
