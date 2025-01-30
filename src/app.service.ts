import { Injectable } from '@nestjs/common';

import { SeedService } from './modules/seed/seed.service';

@Injectable()
export class AppService {
  constructor(private readonly seedService: SeedService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async seedData(): Promise<string> {
    await this.seedService.seed();
    return 'Data seeded successfully';
  }
}
