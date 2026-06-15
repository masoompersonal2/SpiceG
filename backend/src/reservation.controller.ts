import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { CustomerAuthGuard } from './customer.guard';
import { Request } from 'express';

const prisma = new PrismaClient();

@Controller('api/reservations')
export class ReservationController {
  constructor(private jwtService: JwtService) {}

  // Public route with optional customerId
  @Post()
  async createReservation(@Req() req: Request, @Body() body: any) {
    const { name, email, phone, date, time } = body;
    let customerId = null;

    const token = req.cookies?.customerToken;
    if (token) {
      try {
        const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET || 'spicegarden_dev_secret_key' });
        customerId = payload.id;
      } catch (e) {
        // Ignore invalid token for public route
      }
    }

    return await prisma.reservation.create({
      data: { name, email: email || "", phone, date, time, status: "Pending", customerId }
    });
  }

  // Customer route to get their own reservations
  @Get('my')
  @UseGuards(CustomerAuthGuard)
  async getMyReservations(@Req() req: Request) {
    const user = req['user'] as { id: number };
    return await prisma.reservation.findMany({
      where: { customerId: user.id },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Admin route
  @Get()
  @UseGuards(AuthGuard)
  async getReservations() {
    return await prisma.reservation.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  // Admin route to mark status (Pending/Approved/Rejected)
  @Patch(':id/status')
  @UseGuards(AuthGuard)
  async updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    let finalStatus = body.status;
    
    if (finalStatus === 'Approved') {
      const settings = await prisma.restaurantSettings.findUnique({ where: { id: 1 } });
      if (settings && settings.tableBookingFee > 0) {
        finalStatus = 'Payment Pending';
      }
    }

    return await prisma.reservation.update({
      where: { id: parseInt(id) },
      data: { status: finalStatus }
    });
  }

  // Admin route to accept reservation and set custom price
  @Patch(':id/accept-with-price')
  @UseGuards(AuthGuard)
  async acceptWithPrice(@Param('id') id: string, @Body() body: { amount: number }) {
    return await prisma.reservation.update({
      where: { id: parseInt(id) },
      data: { 
        status: 'Payment Pending',
        amount: body.amount
      }
    });
  }

  // Admin route to bulk delete reservations
  @Post('bulk-delete')
  @UseGuards(AuthGuard)
  async bulkDelete(@Body() body: { ids: number[] }) {
    await prisma.reservation.deleteMany({
      where: { id: { in: body.ids } }
    });
    return { success: true };
  }
}
