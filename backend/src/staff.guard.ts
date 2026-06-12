import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class StaffGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies['staffToken'];

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'spicegarden_dev_secret_key',
      });
      
      // Verify role and verify the user still exists with this username (if changed, force logout)
      const staff = await prisma.staff.findUnique({ where: { id: payload.sub } });
      if (!staff || staff.username !== payload.username || payload.role !== 'staff') {
        throw new UnauthorizedException('Credentials changed. Please log in again.');
      }
      
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
