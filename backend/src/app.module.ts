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

import { JwtModule } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

import { prisma } from './prisma';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100, // 100 requests per minute
    }]),
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
    const staffUser = process.env.STAFF_USERNAME || 'spiceStaff';
    const staffPass = process.env.STAFF_PASSWORD || 'staffSPICE';
    const existingStaff = await prisma.staff.findUnique({ where: { username: staffUser } });
    if (!existingStaff) {
      const hashedPassword = await bcrypt.hash(staffPass, 10);
      await prisma.staff.create({
        data: {
          username: staffUser,
          password: hashedPassword
        }
      });
      console.log(`Seeded default Staff account: ${staffUser}`);
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

    // Seed SiteContent if not exists
    const existingContent = await prisma.siteContent.findUnique({ where: { id: 1 } });
    if (!existingContent) {
      console.log('Seeding default SiteContent...');
      await prisma.siteContent.create({
        data: {
          seo: { title: "Spice Garden", metaDescription: "Spice Garden Gokak", favicon: "/favicon.ico" },
          hero: { heroTitle: "SPICE GARDEN", heroSubtitle: "Authentic Flavours", heroLocation: "GOKAK", heroStatsHappyDiners: "15000+", heroStatsMenuItems: "60+" },
          about: { aboutTitle: "FOOD LOVER'S PARADISE" },
          online: { onlineTitle: "ONLINE RESERVATION" },
          call: { callTitle: "Craving Something Delicious?" },
          event: { eventTitle: "Something Special Awaits" },
          promise: { promiseTitle: "OUR PROMISE" },
          footer: { 
            footerDescription: "Gokak's premier family dining restaurant.",
            footerLinks: [],
            footerSocials: []
          }
        }
      });
    }

    // Seed Menu Categories if empty
    const categoryCount = await prisma.contentMenuCategory.count();
    if (categoryCount === 0) {
      console.log('Seeding default ContentMenuCategories...');
      await prisma.contentMenuCategory.createMany({
        data: [
          { name: "All", isEnabled: true, image1: "/section-4/panner.jpg", image2: "/section-4/noodles.jpg", image3: "/section-4/prawns.jpg" },
          { name: "Main Course (Non-Veg)", isEnabled: true, image1: "/section-4/panner.jpg", image2: "/section-4/noodles.jpg", image3: "/section-4/prawns.jpg" },
          { name: "Main Course (Veg)", isEnabled: true, image1: "/section-4/panner.jpg", image2: "/section-4/noodles.jpg", image3: "/section-4/prawns.jpg" },
          { name: "Starters", isEnabled: true, image1: "/section-4/panner.jpg", image2: "/section-4/noodles.jpg", image3: "/section-4/prawns.jpg" }
        ]
      });
    }
  }
}
