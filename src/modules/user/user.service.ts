import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserDoc, User } from './entities/user.entity';
import { IUser } from 'src/common/types/user.types';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<IUserDoc>) {}

  async create(user: IUser) {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findByEmail(email: string): Promise<IUserDoc> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('User not found');
    }
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
