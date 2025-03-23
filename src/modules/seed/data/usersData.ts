import * as bcrypt from 'bcryptjs';
import { IUser } from 'src/common/types/user.types';

export const usersData: IUser[] = [
  {
    email: 'admin@admin.com',
    password: bcrypt.hashSync('Admin@123', 10),
    name: 'Admin',
    shopifyStores: [],
  },
];
