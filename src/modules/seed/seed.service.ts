import { Injectable, Logger } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { usersData } from './data/usersData';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly userService: UserService) {}

  async seed() {
    await this.seedUsers();
  }

  private async seedUsers() {
    this.logger.log('Seeding users...');

    for (const user of usersData) {
      await this.userService.findOneAndUpdate(user.email, user);
    }

    this.logger.log('Users seeded successfully');
  }
}
