import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthGuard } from './auth.guard';

const prisma = new PrismaClient();

@Controller('api/settings')
export class SettingsController {
  
  // Public route to fetch settings (like openTime and closeTime)
  @Get()
  async getSettings() {
    let settings = await prisma.restaurantSettings.findUnique({
      where: { id: 1 }
    });
    if (!settings) {
      settings = await prisma.restaurantSettings.create({
        data: { id: 1, openTime: "18:00", closeTime: "23:00" }
      });
    }
    return settings;
  }

  // Admin route to update settings
  @Put()
  @UseGuards(AuthGuard)
  async updateSettings(@Body() body: { openTime: string, closeTime: string }) {
    return await prisma.restaurantSettings.upsert({
      where: { id: 1 },
      update: { openTime: body.openTime, closeTime: body.closeTime },
      create: { id: 1, openTime: body.openTime, closeTime: body.closeTime }
    });
  }
}
