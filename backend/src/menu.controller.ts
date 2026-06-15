import { Controller, Get, Post, Body, UseGuards, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from './auth.guard';
import { PrismaClient } from '@prisma/client';
import { extname } from 'path';
import { getMulterS3Config } from './s3.config';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

@Controller('api/menu')
export class MenuController {
  
  @Get()
  async getMenu() {
    return await prisma.menuItem.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image', {
    storage: getMulterS3Config()
  }))
  async createMenuItem(@Body() body: any, @UploadedFile() file: any) {
    let imageUrl = '';
    if (file) {
      imageUrl = `${process.env.R2_PUBLIC_URL}/${file.key}`;
    }

    const { name, category, priceText, description, isAvailable, isVegetarian } = body;
    const isAvail = isAvailable === 'true' || isAvailable === true;
    const isVeg = isVegetarian === 'true' || isVegetarian === true;

    return prisma.menuItem.create({
      data: {
        name, category, priceText, description, image: imageUrl,
        isAvailable: isAvail, isVegetarian: isVeg
      }
    });
  }

  @Post('bulk-delete')
  @UseGuards(AuthGuard)
  async bulkDelete(@Body() body: { ids: number[] }) {
    await prisma.menuItem.deleteMany({
      where: { id: { in: body.ids } }
    });
    return { success: true };
  }

  @Post('bulk-update')
  @UseGuards(AuthGuard)
  async bulkUpdate(@Body() body: { items: { id: number; name: string; priceText: string }[] }) {
    // Prisma does not have a bulk update for multiple different records natively, 
    // so we use a transaction of updates.
    const updates = body.items.map(item => 
      prisma.menuItem.update({
        where: { id: item.id },
        data: { name: item.name, priceText: item.priceText }
      })
    );
    await prisma.$transaction(updates);
    return { success: true };
  }
}
