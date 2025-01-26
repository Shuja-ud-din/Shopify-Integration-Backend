import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ITag } from 'src/common/types/product.types';

export type ITagDoc = ITag & Document;

@Schema()
export class Tag implements ITag {
  @Prop({ required: true, unique: true })
  name: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
