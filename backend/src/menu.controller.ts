import { Controller, Get, Post, Body, UseGuards, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from './auth.guard';
import { PrismaClient } from '@prisma/client';
import { diskStorage } from 'multer';
import { extname } from 'path';
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
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueName = uuidv4() + extname(file.originalname);
        cb(null, uniqueName);
      }
    })
  }))
  async createMenuItem(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Image is required');
    
    const { name, category, isVeg, priceText } = body;
    if (!name || !category || !priceText) {
      throw new BadRequestException('Missing required fields');
    }

    const imageUrl = `/uploads/${file.filename}`;
    
    const item = await prisma.menuItem.create({
      data: {
        name,
        category,
        isVeg: isVeg === 'true' || isVeg === true,
        priceText,
        image: imageUrl
      }
    });

    return item;
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
