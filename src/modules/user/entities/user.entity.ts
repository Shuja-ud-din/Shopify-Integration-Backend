import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { IUser } from '../../../common/types/user.types';

@Schema()
export class User implements IUser {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: [] })
  shopifyStores: string[];
}

export type IUserDoc = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
