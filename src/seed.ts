/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./index.d.ts" />
/* eslint-enable @typescript-eslint/triple-slash-reference */

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { SeedService } from './modules/seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const seedService = app.get(SeedService);
    await seedService.seed();
  } catch (error) {
    console.error('Seeding failed', error);
  }

  process.exit(0);
}

bootstrap();
