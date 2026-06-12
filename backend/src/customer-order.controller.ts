import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomerAuthGuard } from './customer.guard';

const prisma = new PrismaClient();

@Controller('api/orders')
export class CustomerOrderController {
  @UseGuards(CustomerAuthGuard)
  @Post()
  async placeOrder(@Req() req: any, @Body() body: any) {
    const { items, totalAmount, paymentMethod } = body;
    
    const order = await prisma.foodOrder.create({
      data: {
        customerId: req.user.sub,
        items,
        totalAmount,
        paymentMethod: paymentMethod || "Cash on Delivery",
        status: "Pending"
      }
    });

    return { message: "Order placed successfully", order };
  }

  @UseGuards(CustomerAuthGuard)
  @Get()
  async getMyOrders(@Req() req: any) {
    return await prisma.foodOrder.findMany({
      where: { customerId: req.user.sub },
      orderBy: { createdAt: 'desc' }
    });
  }
}
