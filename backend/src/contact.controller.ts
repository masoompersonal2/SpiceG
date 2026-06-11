import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthGuard } from './auth.guard';

const prisma = new PrismaClient();

@Controller('api/contact')
export class ContactController {
  
  // Public route to submit contact forms
  @Post()
  async submitContact(@Body() data: any) {
    try {
      const { name, email, phone, message } = data;
      const request = await prisma.contactRequest.create({
        data: {
          name,
          email,
          phone,
          message,
        }
      });
      return { success: true, request };
    } catch (e) {
      return { error: 'Failed to submit contact request' };
    }
  }

  // Protected route for Admin to view contact requests
  @UseGuards(AuthGuard)
  @Get()
  async getContacts() {
    return prisma.contactRequest.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  // Bulk delete contact requests
  @UseGuards(AuthGuard)
  @Post('bulk-delete')
  async bulkDelete(@Body() data: { ids: number[] }) {
    try {
      if (!data.ids || !Array.isArray(data.ids) || data.ids.length === 0) {
        return { success: false, error: 'No IDs provided' };
      }
      
      const result = await prisma.contactRequest.deleteMany({
        where: {
          id: { in: data.ids }
        }
      });
      
      return { success: true, count: result.count };
    } catch (e) {
      return { success: false, error: 'Failed to delete requests' };
    }
  }
}
