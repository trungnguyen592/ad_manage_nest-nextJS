import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // Vì username là mặc định của passport-local => thay vì nhập username trong req body thì nhập email
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Username/Password không hợp lệ.');
    }
    // if (user.isActive === false) {
    //   throw new BadRequestException('Tài khoản chưa được kích hoạt');
    // }
    return user;
  }
}
