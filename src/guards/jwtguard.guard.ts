import {
  BadGatewayException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class jwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Unauthorized 1');
    }
    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Unauthorized 1');
    }

    async function verify(token: string, jwtService: JwtService) {
      let jwt: any;

      try {
        jwt = await jwtService.verify(token, {
          secret: process.env.ACCESS_TOKEN_KEY,
        });
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }

      if (!jwt) {
        throw new UnauthorizedException('Unauthorized 2t');
      }
      if (!jwt.isActive) {
        throw new BadGatewayException('jwt is not activated');
      }
      req.jwt = jwt;
      return true;
    }

    return verify(token, this.jwtService);
  }
}
