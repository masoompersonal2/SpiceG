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
import { StaffAuthController } from './staff-auth.controller';
import { CustomerOrderController } from './customer-order.controller';
import { DeliveryFriendAuthController } from './delivery-friend-auth.controller';
import { AdminDeliveryFriendController } from './admin-delivery-friend.controller';
import { PaymentController } from './payment.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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
  controllers: [AuthController, AdminController, MenuController, ReservationController, SettingsController, ContentController, ContactController, EventsController, CustomerAuthController, StaffAuthController, CustomerOrderController, DeliveryFriendAuthController, AdminDeliveryFriendController, PaymentController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  async onModuleInit() {
    // Seed staff user
    const existingStaff = await prisma.staff.findUnique({ where: { username: 'spiceStaff' } });
    if (!existingStaff) {
      const hashedPassword = await bcrypt.hash('staffSPICE', 10);
      await prisma.staff.create({
        data: {
          username: 'spiceStaff',
          password: hashedPassword
        }
      });
      console.log('Seeded default spiceStaff account');
    }

    // Seed admin user
    const adminUser = process.env.ADMIN_USERNAME || 'AdminS';
    const adminPass = process.env.ADMIN_PASSWORD || 'adminSPICE';
    const existingAdmin = await prisma.admin.findUnique({ where: { username: adminUser } });
    if (!existingAdmin) {
      const hashedAdminPassword = await bcrypt.hash(adminPass, 10);
      await prisma.admin.create({
        data: {
          username: adminUser,
          password: hashedAdminPassword
        }
      });
      console.log(`Seeded default Admin account: ${adminUser}`);
    }
  }
}
