import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv'; // Importujte dotenv

// Konfigurišite dotenv
dotenv.config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform:true,
    transformOptions: {
      enableImplicitConversion: true,
    }
  }))
  await app.listen(3000);
}
bootstrap();
