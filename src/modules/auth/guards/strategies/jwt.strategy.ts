import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../../../../config/jwt.config';
import { IUser } from '@/modules/users/users.interfacce';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, //token het han => cook
      secretOrKey: jwtConfiguration.secret,
      // algorithms: ['RS256'], // Sử dụng thuật toán RS256
      // secretOrKey: configService.get<string>('JWT_PUBLIC_KEY'), // Public key để xác minh
    });
  }

  // nì kiểu như giải mã token
  async validate(payload: IUser) {
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  }
}
