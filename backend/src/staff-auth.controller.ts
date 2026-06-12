import { Controller, Post, Get, Put, Body, Req, Res, UnauthorizedException, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { StaffGuard } from './staff.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

const prisma = new PrismaClient();

@Controller('api/staff')
export class StaffAuthController {
  constructor(private jwtService: JwtService) {}

  @Post('login')
  async login(@Body() body: any, @Res() res: Response) {
    const { username, password } = body;
    const staff = await prisma.staff.findUnique({ where: { username } });

    if (!staff) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: staff.id, username: staff.username, role: 'staff' };
    const token = await this.jwtService.signAsync(payload);

    res.cookie('staffToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: 'Login successful' });
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('staffToken');
    return res.status(200).json({ message: 'Logout successful' });
  }

  @UseGuards(StaffGuard)
  @Get('profile')
  async getProfile(@Req() req: any) {
    const staff = await prisma.staff.findUnique({
      where: { id: req.user.sub },
      select: { id: true, username: true, profileImage: true }
    });
    if (!staff) throw new UnauthorizedException('Staff not found');
    return staff;
  }

  @UseGuards(StaffGuard)
  @Put('profile-image')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  async updateProfileImage(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new Error("File missing");
    
    const imageUrl = `/uploads/${file.filename}`;
    await prisma.staff.update({
      where: { id: req.user.sub },
      data: { profileImage: imageUrl }
    });

    return { imageUrl };
  }

  @UseGuards(StaffGuard)
  @Post('credential-request')
  async requestCredentialChange(@Req() req: any, @Body() body: any) {
    const { newUsername, newPassword } = body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.credentialRequest.create({
      data: {
        staffId: req.user.sub,
        newUsername,
        newPassword: hashedPassword,
        status: "Pending"
      }
    });
    return { message: "Credential change request submitted to admin." };
  }

  @UseGuards(StaffGuard)
  @Get('orders')
  async getOrders() {
    // Return today's orders (or just all for simplicity, can filter by date later)
    return await prisma.foodOrder.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  @UseGuards(StaffGuard)
  @Put('orders/:id/status')
  async updateOrderStatus(@Req() req: any, @Body() body: any) {
    const { orderId, status, message } = body;
    const order = await prisma.foodOrder.update({
      where: { id: parseInt(orderId) },
      data: {
        status,
        staffMessage: message
      }
    });
    return order;
  }
}
