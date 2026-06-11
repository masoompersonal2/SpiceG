import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const uploadDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const app = await NestFactory.create(AppModule);

  // Security Headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  // Cookie Parser for HTTP-Only cookies
  app.use(cookieParser());

  // Strict CORS configuration
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Add production frontend domains later
    credentials: true,
  });

  // Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // Global Exception Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
  console.log("Backend running and database connected");
}
bootstrap();
