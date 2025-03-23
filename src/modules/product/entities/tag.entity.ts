import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ITag } from 'src/common/types/product.types';

@Schema()
export class Tag implements ITag {
  @Prop({ required: true, unique: true })
  name: string;
}

export type ITagDoc = HydratedDocument<Tag>;
export const TagSchema = SchemaFactory.createForClass(Tag);
