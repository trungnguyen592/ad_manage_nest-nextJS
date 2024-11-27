import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable } from '@nestjs/common';

import { Request } from 'express';
import { AuthService } from '../../auth.service';
import refreshJwtConfig from '../../../../config/refresh-jwt.config';
import { IUser } from '@/modules/users/users.interfacce';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    @Inject(refreshJwtConfig.KEY)
    private refrshJwtConfiguration: ConfigType<typeof refreshJwtConfig>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: refrshJwtConfiguration.secret,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: IUser) {
    const refresh_token = req
      .get('Authorization')
      ?.replace('Bearer', '')
      .trim();
    const id = payload.id;
    return this.authService.validateRefreshToken(id, refresh_token);
  }
}
