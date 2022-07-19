import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const graphqlUploadExpress = require('graphql-upload/graphqlUploadExpress.js');

async function bootstrap(): Promise<void> {
  console.log(1);
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV == 'production') {
    const helmet = require('helmet');
    app.use(helmet());
  }

  app.use(graphqlUploadExpress({ maxFileSize: 2 * 1000 * 1000 }));

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  const port: number = +process.env.PORT;
  await app.listen(port);
}

bootstrap();
