import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import * as path from 'path';

export const crashLogs: string[] = [];

process.on('uncaughtException', (err) => {
  crashLogs.push(`UncaughtException: ${err.message}\n${err.stack}`);
  console.error("UncaughtException caught to prevent crash:", err);
});

process.on('unhandledRejection', (reason: any) => {
  crashLogs.push(`UnhandledRejection: ${reason?.message || reason}`);
  console.error("UnhandledRejection caught to prevent crash:", reason);
});

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
    origin: true, // Dynamically accepts the request origin (Vercel domain)
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
