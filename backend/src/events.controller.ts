import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthGuard } from './auth.guard';

const prisma = new PrismaClient();

@Controller('api/events')
export class EventsController {
  
  // Public route to view events
  @Get()
  async getEvents() {
    return prisma.ticketEvent.findMany({
      orderBy: { date: 'asc' }
    });
  }

  @UseGuards(AuthGuard)
  @Post()
  async createEvent(@Body() data: any) {
    return prisma.ticketEvent.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        location: data.location,
        date: new Date(data.date),
        price: Number(data.price),
        totalSeats: Number(data.totalSeats),
        image: data.image,
        isEnabled: data.isEnabled ?? true
      }
    });
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateEvent(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.subtitle !== undefined) updateData.subtitle = data.subtitle;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.date !== undefined) updateData.date = new Date(data.date);
    if (data.price !== undefined) updateData.price = Number(data.price);
    if (data.totalSeats !== undefined) updateData.totalSeats = Number(data.totalSeats);
    if (data.bookedSeats !== undefined) updateData.bookedSeats = Number(data.bookedSeats);
    if (data.image !== undefined) updateData.image = data.image;
    if (data.isEnabled !== undefined) updateData.isEnabled = data.isEnabled;

    return prisma.ticketEvent.update({
      where: { id },
      data: updateData
    });
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteEvent(@Param('id', ParseIntPipe) id: number) {
    return prisma.ticketEvent.delete({
      where: { id }
    });
  }
}
