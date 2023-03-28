import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }
  
  use(req: any, res: any, next: () => void) {
    const auth = req.headers.authorization;
    if (!auth) {
      next();
      return;
    }
    const [bearer, token] = auth.split(' ');
    if (bearer === "Bearer" && token) {
      const user = this.jwtService.verify(token, { secret: this.configService.get('JWT_SECRET') });
      req.user = user;
    }
    next();
  }
}
