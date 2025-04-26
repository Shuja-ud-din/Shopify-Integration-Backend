import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class StoreGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    const store = request.query.store as string;

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (!store) {
      throw new ForbiddenException('Missing store ID');
    }

    if (!store.match(/^[0-9a-fA-F]{24}$/)) {
      throw new ForbiddenException('Invalid store ID');
    }

    const userExists = await this.userModel.findById(user.id);
    if (!userExists) {
      throw new ForbiddenException('User not found');
    }

    const storeExists = userExists.shopifyStores.includes(store);

    if (!storeExists) {
      throw new ForbiddenException('You do not have access to this store');
    }

    return true;
  }
}
