import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class CustomerAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeaderOrCookie(request);
    
    if (!token) {
      throw new UnauthorizedException();
    }
    
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'crave_dev_secret_key'
      });
      request['user'] = payload; // Payload contains { id, email }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeaderOrCookie(request: Request): string | undefined {
    // Check cookies first
    if (request.cookies && request.cookies['customerToken']) {
      return request.cookies['customerToken'];
    }
    
    // Fallback to Bearer token
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
