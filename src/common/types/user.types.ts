import mongoose from 'mongoose';

import { IUserDoc } from '@/modules/user/entities/user.entity';

export interface IUser {
  name: string;
  email: string;
  password: string;
  shopifyStores: string[] | IShopifyStore[];
}

export interface IShopifyStore {
  name: string;
  accessToken: string;
  url: string;
  userId: mongoose.Types.ObjectId | IUserDoc;
}
