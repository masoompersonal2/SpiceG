import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthGuard } from './auth.guard';

const prisma = new PrismaClient();

@Controller('api/reservations')
export class ReservationController {
  
  // Public route
  @Post()
  async createReservation(@Body() body: any) {
    const { name, email, phone, date, time } = body;
    return await prisma.reservation.create({
      data: { name, email: email || "", phone, date, time, status: "Pending" }
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
    return await prisma.reservation.update({
      where: { id: parseInt(id) },
      data: { status: body.status }
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
