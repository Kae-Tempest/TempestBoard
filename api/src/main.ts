import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      logLevels: ['error', 'warn', 'debug', 'log'],
      colors: true,
      prefix: 'TempestBoard-API',
      compact: true,
      breakLength: 80,
    }),
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  // Serve static files from the uploads directory
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('TempestBoard-API')
    .setDescription('TempestBoard-API')
    .setVersion('1.0')
    .build();

  const documentBuilder = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentBuilder);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
