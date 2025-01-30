import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  healthCheck() {
    return 'Server is UP and RUNNING... 🚀';
  }

  @Get('seed')
  seed() {
    return this.appService.seedData();
  }
}
