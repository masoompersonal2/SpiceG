import { Controller, Get, Put, Post, Body, UseGuards, Req, UploadedFile, UseInterceptors, BadRequestException, Param, UnauthorizedException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from './auth.guard';
import { PrismaClient } from '@prisma/client';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

@Controller('api/admin')
@UseGuards(AuthGuard)
export class AdminController {
  
  @Get('profile')
  async getProfile(@Req() req: any) {
    const admin = await prisma.admin.findUnique({
      where: { id: req.user.id }
    });
    if (!admin) throw new BadRequestException('Admin not found');
    return {
      id: admin.id,
      username: admin.username,
      profileImage: admin.profileImage
    };
  }

  @Put('profile')
  async updateProfile(@Req() req: any, @Body() body: any) {
    const { username, password } = body;
    const updateData: any = {};
    
    if (username) updateData.username = username;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const updated = await prisma.admin.update({
      where: { id: req.user.id },
      data: updateData
    });

    return {
      message: 'Profile updated',
      username: updated.username
    };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueName = uuidv4() + extname(file.originalname);
        cb(null, uniqueName);
      }
    })
  }))
  async uploadProfileImage(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');

    const imageUrl = `/uploads/${file.filename}`;
    await prisma.admin.update({
      where: { id: req.user.id },
      data: { profileImage: imageUrl }
    });

    return { imageUrl };
  }
}
