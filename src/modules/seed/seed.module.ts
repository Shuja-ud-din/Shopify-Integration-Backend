import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { SeedService } from './seed.service';

@Module({
  providers: [SeedService],
  exports: [SeedService],
  imports: [UserModule],
})
export class SeedModule {}
