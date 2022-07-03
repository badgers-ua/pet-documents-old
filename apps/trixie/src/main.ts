import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV == 'production') {
    const helmet = require('helmet');
    app.use(helmet());
  }
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  const port: number = +process.env.PORT;
  await app.listen(port);
}

bootstrap();
