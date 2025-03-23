import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { IProductGroup } from 'src/common/types/product.types';

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

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;

  @Prop({ default: false })
  isScraping: boolean;
}

export const ProductGroupSchema = SchemaFactory.createForClass(ProductGroup);
