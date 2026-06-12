import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AuthController } from './auth.controller';
import { AdminController } from './admin.controller';
import { MenuController } from './menu.controller';
import { ReservationController } from './reservation.controller';
import { SettingsController } from './settings.controller';
import { ContentController } from './content.controller';
import { ContactController } from './contact.controller';
import { EventsController } from './events.controller';
import { CustomerAuthController } from './customer-auth.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100, // 100 requests per minute
    }]),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'spicegarden_dev_secret_key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController, AdminController, MenuController, ReservationController, SettingsController, ContentController, ContactController, EventsController, CustomerAuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
