import { Controller, Post, Get, Put, Body, Req, Res, UseGuards, UnauthorizedException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { Controller, Post, Get, Put, Body, Req, Res, UseGuards, UnauthorizedException, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { DeliveryFriendAuthGuard } from './delivery-friend.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { getMulterS3Config } from './s3.config';
import * as path from 'path';

const prisma = new PrismaClient();

@Controller('api/delivery-friend')
export class DeliveryFriendAuthController {
  constructor(private jwtService: JwtService) {}

  @Post('login')
  async login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const { uniqueId, password } = body;
    const friend = await prisma.deliveryFriend.findUnique({ where: { uniqueId } });
    if (!friend) throw new UnauthorizedException("Invalid unique ID or password");

    const isMatch = await bcrypt.compare(password, friend.password);
    if (!isMatch) throw new UnauthorizedException("Invalid unique ID or password");

    const payload = { sub: friend.id, uniqueId: friend.uniqueId, role: 'DeliveryFriend' };
    const token = await this.jwtService.signAsync(payload);

    res.cookie('deliveryFriendToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return { message: "Login successful" };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('deliveryFriendToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    return { message: "Logout successful" };
  }

  @UseGuards(DeliveryFriendAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: any) {
    const friend = await prisma.deliveryFriend.findUnique({
      where: { id: req.user.sub },
      select: { id: true, uniqueId: true, name: true, profileImage: true, status: true, mobile: true, email: true, address: true, idCardNumber: true }
    });
    return friend;
  }

  @UseGuards(DeliveryFriendAuthGuard)
  @Put('profile')
  async updateProfile(@Req() req: any, @Body() body: any) {
    const { name, password } = body;
    const updateData: any = { name };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    await prisma.deliveryFriend.update({
      where: { id: req.user.sub },
      data: updateData
    });
    return { message: "Profile updated" };
  }

  @UseGuards(DeliveryFriendAuthGuard)
  @Put('status')
  async updateStatus(@Req() req: any, @Body() body: any) {
    const { status } = body; // Available, Delivering, On Leave
    const data: any = { status };
    if (status === 'Available') {
      data.availableSince = new Date();
    } else {
      data.availableSince = null;
    }
    await prisma.deliveryFriend.update({
      where: { id: req.user.sub },
      data
    });
    return { message: "Status updated" };
  }

  @UseGuards(DeliveryFriendAuthGuard)
  @Post('update-request')
  async requestUpdate(@Req() req: any, @Body() body: any) {
    const { newMobile, newEmail, newAddress } = body;
    await prisma.deliveryFriendRequest.create({
      data: {
        deliveryFriendId: req.user.sub,
        newMobile,
        newEmail,
        newAddress,
      }
    });
    return { message: "Request submitted to Admin" };
  }

  @UseGuards(DeliveryFriendAuthGuard)
  @Get('active-orders')
  async getActiveOrders(@Req() req: any) {
    // Delivery friend should see orders assigned to them that are "Out for Delivery"
    return await prisma.foodOrder.findMany({
      where: { 
        deliveryFriendId: req.user.sub,
        status: { in: ['Approved', 'Out for Delivery'] }
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  @UseGuards(DeliveryFriendAuthGuard)
  @Put('orders/:id/delivered')
  async markDelivered(@Req() req: any) {
    const urlParts = req.url.split('/');
    const orderId = parseInt(urlParts[urlParts.length - 2], 10);
    
    await prisma.foodOrder.updateMany({
      where: { id: orderId, deliveryFriendId: req.user.sub },
      data: { status: 'Delivered' }
    });
    return { message: "Order marked as Delivered" };
  }

  @UseGuards(DeliveryFriendAuthGuard)
  @Get('past-deliveries')
  async getPastDeliveries(@Req() req: any) {
    const orders = await prisma.foodOrder.findMany({
      where: { 
        deliveryFriendId: req.user.sub,
        status: 'Delivered'
      },
      orderBy: { updatedAt: 'desc' }
    });

    const detailedOrders = await Promise.all(orders.map(async (order) => {
      const customerRecord = await prisma.customer.findUnique({
        where: { id: order.customerId },
        select: { fullName: true, email: true }
      });
      const username = customerRecord?.fullName || customerRecord?.email?.split('@')[0] || `User #${order.customerId}`;
      return { ...order, customer: { username } };
    }));

    return detailedOrders;
  }

  @Post('profile-image')
  @UseGuards(DeliveryFriendAuthGuard)
  @UseInterceptors(FileInterceptor('image', {
    storage: getMulterS3Config()
  }))
  async uploadProfilePicture(@Req() req: any, @UploadedFile() file: any) {
    if (!file) throw new BadRequestException('No file uploaded');
    
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${file.key}`;
    await prisma.deliveryFriend.update({
      where: { id: req.user.sub },
      data: { profileImage: publicUrl }
    });

    return { url: publicUrl };
  }
}
