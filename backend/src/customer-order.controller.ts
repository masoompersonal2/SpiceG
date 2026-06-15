import { Controller, Post, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomerAuthGuard } from './customer.guard';

import { prisma } from './prisma';

@Controller('api/orders')
export class CustomerOrderController {
  @UseGuards(CustomerAuthGuard)
  @Post()
  async placeOrder(@Req() req: any, @Body() body: any) {
    const { items, totalAmount, paymentMethod, deliveryType, streetAddress, receiverName, receiverMobile, homeImage, feeBreakdown } = body;
    
    const customer = await prisma.customer.findUnique({ where: { id: req.user.id || req.user.sub }});

    const order = await prisma.foodOrder.create({
      data: {
        customerId: req.user.id || req.user.sub,
        items,
        totalAmount,
        paymentMethod: paymentMethod || "Cash on Delivery",
        deliveryType: deliveryType || "Delivery",
        status: "Pending",
        customerLocation: customer?.deliveryLocation || null,
        streetAddress: streetAddress || customer?.streetAddress,
        receiverName: receiverName || customer?.receiverName,
        receiverMobile: receiverMobile || customer?.receiverMobile,
        homeImage: homeImage || customer?.homeImage,
        feeBreakdown: feeBreakdown || {}
      }
    });

    return { message: "Order placed successfully", order };
  }

  @UseGuards(CustomerAuthGuard)
  @Get()
  async getMyOrders(@Req() req: any) {
    const orders = await prisma.foodOrder.findMany({
      where: { customerId: req.user.id || req.user.sub },
      orderBy: { createdAt: 'desc' }
    });
    
    const detailedOrders = await Promise.all(orders.map(async (order) => {
      let friend = null;
      if (order.deliveryFriendId) {
        friend = await prisma.deliveryFriend.findUnique({
          where: { id: order.deliveryFriendId },
          select: { id: true, name: true, uniqueId: true, profileImage: true, mobile: true }
        });
      }
      return { ...order, deliveryFriend: friend };
    }));
    
    return detailedOrders;
  }

  @UseGuards(CustomerAuthGuard)
  @Put(':id/cancel')
  async cancelOrder(@Req() req: any, @Body() body: any) {
    const id = parseInt(req.url.split('/')[3], 10); // Extract from URL properly if params decorator fails occasionally
    
    // Safer way:
    const urlParts = req.url.split('/');
    const orderId = parseInt(urlParts[urlParts.length - 2], 10);
    
    const order = await prisma.foodOrder.findFirst({
      where: { id: orderId, customerId: req.user.id || req.user.sub }
    });

    if (!order) return { message: "Not found" };
    if (order.status !== 'Pending') return { message: "Cannot cancel processed orders" };

    const cancelledOrder = await prisma.foodOrder.update({
      where: { id: orderId },
      data: { status: 'Cancelled' }
    });
    return cancelledOrder;
  }

  @UseGuards(CustomerAuthGuard)
  @Put('bulk-delete')
  async bulkDeleteOrders(@Req() req: any, @Body() body: any) {
    const { orderIds } = body;
    if (!orderIds || !Array.isArray(orderIds)) return { message: "Invalid request" };

    // Delete orders that belong to this customer
    await prisma.foodOrder.deleteMany({
      where: {
        id: { in: orderIds },
        customerId: req.user.id || req.user.sub
      }
    });

    return { message: "Orders deleted successfully" };
  }
}
