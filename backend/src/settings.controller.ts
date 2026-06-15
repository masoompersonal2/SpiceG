import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthGuard } from './auth.guard';
import { StaffGuard } from './staff.guard';

import { prisma } from './prisma';

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
  async updateSettings(@Body() body: { 
    openTime: string, 
    closeTime: string,
    gstEnabled: boolean,
    gstPercentage: number,
    platformFee: number,
    deliveryCharge: number,
    tableBookingFee: number,
    customFees: any
  }) {
    return await prisma.restaurantSettings.upsert({
      where: { id: 1 },
      update: { 
        openTime: body.openTime, 
        closeTime: body.closeTime,
        gstEnabled: body.gstEnabled,
        gstPercentage: body.gstPercentage,
        platformFee: body.platformFee,
        deliveryCharge: body.deliveryCharge,
        tableBookingFee: body.tableBookingFee,
        customFees: body.customFees || []
      },
      create: { 
        id: 1, 
        openTime: body.openTime, 
        closeTime: body.closeTime,
        gstEnabled: body.gstEnabled ?? true,
        gstPercentage: body.gstPercentage ?? 18,
        platformFee: body.platformFee ?? 0,
        deliveryCharge: body.deliveryCharge ?? 0,
        tableBookingFee: body.tableBookingFee ?? 0,
        customFees: body.customFees || []
      }
    });
  }

  // Staff route to update settings
  @Put('staff')
  @UseGuards(StaffGuard)
  async updateStaffSettings(@Body() body: { 
    openTime: string, 
    closeTime: string,
    gstEnabled: boolean,
    gstPercentage: number,
    platformFee: number,
    deliveryCharge: number,
    tableBookingFee: number,
    customFees: any
  }) {
    return await prisma.restaurantSettings.upsert({
      where: { id: 1 },
      update: { 
        gstEnabled: body.gstEnabled,
        gstPercentage: body.gstPercentage,
        platformFee: body.platformFee,
        deliveryCharge: body.deliveryCharge,
        tableBookingFee: body.tableBookingFee,
        customFees: body.customFees || []
      },
      create: { 
        id: 1, 
        openTime: "18:00", 
        closeTime: "23:00",
        gstEnabled: body.gstEnabled ?? true,
        gstPercentage: body.gstPercentage ?? 18,
        platformFee: body.platformFee ?? 0,
        deliveryCharge: body.deliveryCharge ?? 0,
        tableBookingFee: body.tableBookingFee ?? 0,
        customFees: body.customFees || []
      }
    });
  }
}
