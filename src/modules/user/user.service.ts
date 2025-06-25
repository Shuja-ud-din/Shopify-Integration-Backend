import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IUser } from '@/common/types/user.types';

import { IUserDoc, User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<IUserDoc>) {}

  async create(user: IUser) {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findByEmail(email: string): Promise<IUserDoc> {
    const user = await this.userModel.findOne({ email });

    return user;
  }

  async findById(id: string): Promise<IUserDoc> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  async findOneAndUpdate(email: string, update: Partial<IUser>) {
    return this.userModel.findOneAndUpdate({ email }, update, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
  }
}
