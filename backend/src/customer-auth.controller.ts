import { Body, Controller, Delete, Get, Post, Put, Req, Res, UnauthorizedException, UseGuards, HttpException, HttpStatus, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { CustomerLoginDto, CustomerSignupDto, CustomerSetupDto, CustomerProfileUpdateDto, CustomerPasswordUpdateDto } from './dto/customer.dto';
import { CustomerAuthGuard } from './customer.guard';

const prisma = new PrismaClient();

@Controller('api/customer/auth')
export class CustomerAuthController {
  constructor(private jwtService: JwtService) {}

  @Post('signup')
  async signup(@Body() dto: CustomerSignupDto, @Res({ passthrough: true }) res: Response) {
    const existing = await prisma.customer.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const customer = await prisma.customer.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        isSetupComplete: false,
      }
    });

    const payload = { id: customer.id, email: customer.email };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'spicegarden_dev_secret_key'
    });

    res.cookie('customerToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return { success: true, customer: { id: customer.id, email: customer.email, isSetupComplete: customer.isSetupComplete } };
  }

  @Post('login')
  async login(@Body() dto: CustomerLoginDto, @Res({ passthrough: true }) res: Response) {
    const customer = await prisma.customer.findUnique({ where: { email: dto.email } });
    if (!customer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, customer.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: customer.id, email: customer.email };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'spicegarden_dev_secret_key'
    });

    res.cookie('customerToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return { success: true, customer: { id: customer.id, email: customer.email, isSetupComplete: customer.isSetupComplete } };
  }

  @UseGuards(CustomerAuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('customerToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    return { success: true };
  }

  @UseGuards(CustomerAuthGuard)
  @Post('cancel-setup')
  async cancelSetup(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req['user'] as { id: number };
    
    // Ensure we only delete if not setup
    const customer = await prisma.customer.findUnique({ where: { id: user.id } });
    if (customer && !customer.isSetupComplete) {
      await prisma.customer.delete({ where: { id: user.id } });
    }

    res.clearCookie('customerToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return { success: true };
  }

  @UseGuards(CustomerAuthGuard)
  @Put('setup')
  async setup(@Req() req: Request, @Body() dto: CustomerSetupDto) {
    const user = req['user'] as { id: number };
    
    const customer = await prisma.customer.update({
      where: { id: user.id },
      data: {
        fullName: dto.fullName,
        mobile: dto.mobile,
        location: dto.location,
        profileImage: dto.profileImage || null,
        isSetupComplete: true,
      }
    });

    return { success: true, customer: { id: customer.id, email: customer.email, isSetupComplete: customer.isSetupComplete } };
  }

  @UseGuards(CustomerAuthGuard)
  @Get('me')
  async getMe(@Req() req: Request) {
    const user = req['user'] as { id: number };
    const customer = await prisma.customer.findUnique({ where: { id: user.id } });
    if (!customer) throw new UnauthorizedException();
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeCustomer } = customer;
    return safeCustomer;
  }

  @UseGuards(CustomerAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueName = uuidv4() + extname(file.originalname);
        cb(null, uniqueName);
      }
    })
  }))
  async uploadProfileImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');

    const imageUrl = `/uploads/${file.filename}`;
    return { imageUrl };
  }

  @UseGuards(CustomerAuthGuard)
  @Put('profile')
  async updateProfile(@Req() req: Request, @Body() dto: CustomerProfileUpdateDto) {
    const user = req['user'] as { id: number };
    const customer = await prisma.customer.update({
      where: { id: user.id },
      data: {
        fullName: dto.fullName,
        mobile: dto.mobile,
        location: dto.location,
        profileImage: dto.profileImage || undefined,
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeCustomer } = customer;
    return { success: true, customer: safeCustomer };
  }

  @UseGuards(CustomerAuthGuard)
  @Put('password')
  async updatePassword(@Req() req: Request, @Body() dto: CustomerPasswordUpdateDto) {
    const user = req['user'] as { id: number };
    const customer = await prisma.customer.findUnique({ where: { id: user.id } });
    if (!customer) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(dto.previousPassword, customer.password);
    if (!isMatch) {
      throw new BadRequestException('Incorrect previous password');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.newPassword, salt);

    await prisma.customer.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return { success: true };
  }

  @UseGuards(CustomerAuthGuard)
  @Get('events')
  async getMyEvents(@Req() req: Request) {
    const user = req['user'] as { id: number };
    const bookings = await prisma.ticketBooking.findMany({
      where: { customerId: user.id },
      orderBy: { createdAt: 'desc' }
    });
    
    // Fetch full event details for each booking
    const eventIds = bookings.map(b => b.eventId);
    const events = await prisma.ticketEvent.findMany({
      where: { id: { in: eventIds } }
    });

    return bookings.map(b => ({
      ...b,
      event: events.find(e => e.id === b.eventId)
    }));
  }

  @UseGuards(CustomerAuthGuard)
  @Post('events/book')
  async bookEvent(@Req() req: Request, @Body() body: { eventId: number }) {
    const user = req['user'] as { id: number };
    
    // Verify event exists and has seats
    const event = await prisma.ticketEvent.findUnique({ where: { id: body.eventId } });
    if (!event) throw new BadRequestException('Event not found');
    if (event.bookedSeats >= event.totalSeats) throw new BadRequestException('Event is fully booked');

    // Create booking
    const booking = await prisma.ticketBooking.create({
      data: {
        customerId: user.id,
        eventId: body.eventId,
        tickets: 1,
        status: 'Confirmed'
      }
    });

    // Increment booked seats
    await prisma.ticketEvent.update({
      where: { id: body.eventId },
      data: { bookedSeats: { increment: 1 } }
    });

    return { success: true, booking };
  }
}
