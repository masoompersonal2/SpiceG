import { Controller, Post, Get, Put, Delete, Body, Req, UseGuards, Param } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthGuard } from './auth.guard';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

@Controller('api/admin/delivery-friends')
export class AdminDeliveryFriendController {
  
  @UseGuards(AuthGuard)
  @Post('hire')
  async hireFriend(@Body() body: any) {
    const { name, email, mobile, idCardImage, idCardNumber, address, resumeFile, password } = body;
    
    // Generate uniqueId DFSGXXXX
    const rand = Math.floor(1000 + Math.random() * 9000);
    const uniqueId = `DFSG${rand}`;
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const friend = await prisma.deliveryFriend.create({
      data: {
        uniqueId,
        password: hashedPassword,
        name,
        email,
        mobile,
        idCardImage,
        idCardNumber,
        address,
        resumeFile
      }
    });

    return { message: "Delivery Friend hired", friend };
  }

  @UseGuards(AuthGuard)
  @Get()
  async listFriends() {
    return await prisma.deliveryFriend.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateFriend(@Param('id') id: string, @Body() body: any) {
    const friendId = parseInt(id, 10);
    const { name, email, mobile, address } = body;
    await prisma.deliveryFriend.update({
      where: { id: friendId },
      data: { name, email, mobile, address }
    });
    return { message: "Delivery Friend updated" };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async fireFriend(@Param('id') id: string) {
    const friendId = parseInt(id, 10);
    await prisma.deliveryFriend.delete({ where: { id: friendId } });
    return { message: "Delivery Friend fired" };
  }

  @UseGuards(AuthGuard)
  @Get('requests')
  async listRequests() {
    return await prisma.deliveryFriendRequest.findMany({
      where: { status: 'Pending' }
    });
  }
  
  // Wait, I should add relation in Prisma schema between DeliveryFriend and DeliveryFriendRequest, but without relation we can fetch manually.
  @UseGuards(AuthGuard)
  @Get('requests-detailed')
  async listRequestsDetailed() {
    const requests = await prisma.deliveryFriendRequest.findMany({
      where: { status: 'Pending' }
    });
    
    const detailed = await Promise.all(requests.map(async req => {
      const friend = await prisma.deliveryFriend.findUnique({ where: { id: req.deliveryFriendId }});
      return { ...req, friendName: friend?.name, friendUniqueId: friend?.uniqueId };
    }));
    return detailed;
  }

  @UseGuards(AuthGuard)
  @Put('requests/:id/approve')
  async approveRequest(@Param('id') id: string) {
    const reqId = parseInt(id, 10);
    const request = await prisma.deliveryFriendRequest.findUnique({ where: { id: reqId }});
    if (!request) return { message: "Not found" };

    const updateData: any = {};
    if (request.newMobile) updateData.mobile = request.newMobile;
    if (request.newEmail) updateData.email = request.newEmail;
    if (request.newAddress) updateData.address = request.newAddress;

    await prisma.deliveryFriend.update({
      where: { id: request.deliveryFriendId },
      data: updateData
    });

    await prisma.deliveryFriendRequest.update({
      where: { id: reqId },
      data: { status: 'Approved' }
    });

    return { message: "Approved" };
  }

  @UseGuards(AuthGuard)
  @Put('requests/:id/reject')
  async rejectRequest(@Param('id') id: string) {
    const reqId = parseInt(id, 10);
    await prisma.deliveryFriendRequest.update({
      where: { id: reqId },
      data: { status: 'Rejected' }
    });
    return { message: "Rejected" };
  }
}
