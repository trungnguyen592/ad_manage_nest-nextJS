import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, //token het han => cook
      secretOrKey: configService.get<string>('JWT_SECRET'),
      // algorithms: ['RS256'], // Sử dụng thuật toán RS256
      // secretOrKey: configService.get<string>('JWT_PUBLIC_KEY'), // Public key để xác minh
    });
  }

  // nì kiểu như giải mã token
  async validate(payload: any) {
    return { id: payload.id, email: payload.email };
  }
}
