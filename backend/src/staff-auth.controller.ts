import { Controller, Post, Get, Put, Body, Req, Res, UnauthorizedException, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { StaffGuard } from './staff.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { getMulterS3Config } from './s3.config';

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
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: 'Login successful' });
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('staffToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
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

  @Put('profile-image')
  @UseGuards(StaffGuard)
  @UseInterceptors(FileInterceptor('image', {
    storage: getMulterS3Config()
  }))
  async uploadProfilePicture(@Req() req: any, @UploadedFile() file: any) {
    if (!file) throw new BadRequestException('No file uploaded');
    
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${file.key}`;
    await prisma.staff.update({
      where: { id: req.user.sub },
      data: { profileImage: publicUrl }
    });

    return { url: publicUrl };
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
    const orders = await prisma.foodOrder.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // Attach delivery friend details if any
    const detailedOrders = await Promise.all(orders.map(async (order) => {
      let friend = null;
      if (order.deliveryFriendId) {
        friend = await prisma.deliveryFriend.findUnique({
          where: { id: order.deliveryFriendId },
          select: { id: true, name: true, uniqueId: true, profileImage: true, mobile: true }
        });
      }
      
      const customerRecord = await prisma.customer.findUnique({
        where: { id: order.customerId },
        select: { fullName: true, email: true }
      });
      const username = customerRecord?.fullName || customerRecord?.email?.split('@')[0] || `User #${order.customerId}`;
      
      return { ...order, deliveryFriend: friend, customer: { username } };
    }));
    
    return detailedOrders;
  }

  @UseGuards(StaffGuard)
  @Get('available-friends')
  async getAvailableFriends() {
    return await prisma.deliveryFriend.findMany({
      where: { status: 'Available' },
      orderBy: { availableSince: 'asc' },
      select: { id: true, name: true, uniqueId: true, mobile: true, profileImage: true }
    });
  }

  @UseGuards(StaffGuard)
  @Put('orders/:id/status')
  async updateOrderStatus(@Req() req: any, @Body() body: any) {
    const { orderId, status, message, deliveryFriendId } = body;
    const data: any = { status };
    if (status === 'Rejected') {
      data.staffMessage = message;
    }
    if (deliveryFriendId) {
      data.deliveryFriendId = parseInt(deliveryFriendId);
    }
    const order = await prisma.foodOrder.update({
      where: { id: parseInt(orderId) },
      data
    });
    return order;
  }

  @UseGuards(StaffGuard)
  @Put('orders/bulk-delete')
  async bulkDeleteOrders(@Req() req: any, @Body() body: any) {
    const { orderIds } = body;
    if (!orderIds || !Array.isArray(orderIds)) return { message: "Invalid request" };

    // Delete selected orders
    await prisma.foodOrder.deleteMany({
      where: {
        id: { in: orderIds }
      }
    });

    return { message: "Orders deleted successfully" };
  }
}
