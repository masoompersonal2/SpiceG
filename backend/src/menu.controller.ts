import { Controller, Get, Post, Body, UseGuards, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from './auth.guard';
import { PrismaClient } from '@prisma/client';
import { extname } from 'path';
import { getCloudinaryStorage } from './cloudinary.config';
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
    storage: getCloudinaryStorage()
  }))
  async createMenuItem(@Body() body: any, @UploadedFile() file: any) {
    let imageUrl = '';
    if (file) {
      imageUrl = file.path;
    }

    const { name, category, isVeg, priceText } = body;
    if (!name || !category || !priceText) {
      throw new BadRequestException('Missing required fields');
    }

    return prisma.menuItem.create({
      data: {
        name,
        category,
        isVeg: isVeg === 'true' || isVeg === true,
        priceText,
        image: imageUrl
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
