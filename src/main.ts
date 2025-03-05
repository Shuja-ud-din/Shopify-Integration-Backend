import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Bootstrap');

  const configService = app.get(ConfigService);
  const port = configService.get('app.port');
  const globalPrefix = configService.get('app.globalPrefix');
  const corsEnabled = configService.get('app.corsEnabled');

  if (corsEnabled) {
    app.enableCors();
  }

  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(port);
  logger.log(`Server started on http://localhost:${port}`);
}
bootstrap();
