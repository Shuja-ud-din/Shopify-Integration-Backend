import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Bootstrap');

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Server started on http://localhost:${process.env.PORT || 3000}`);
}
bootstrap();
