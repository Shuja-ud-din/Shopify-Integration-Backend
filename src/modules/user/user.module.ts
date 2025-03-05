import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User } from './entities/user.entity';
import { UserSchema } from './entities/user.entity';
import { UserService } from './user.service';

@Module({
  providers: [UserService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
