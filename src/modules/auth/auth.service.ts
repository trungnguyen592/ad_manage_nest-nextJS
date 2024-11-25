import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ChangePasswordAuthDto,
  CodeAuthDto,
  CreateAuthDto,
} from './dto/create-auth.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePasswordHelper } from '@/util/helper';
import { User } from '../users/entities/user.entity';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (!user) return null;

    const isValidPassword = await comparePasswordHelper(pass, user.password);
    if (!isValidPassword) return null;
    return user;
  }

  async login(user: Partial<User>, response: Response) {
    // Kiểm tra nếu email và id không tồn tại
    if (!user.email || !user.password) {
      throw new BadRequestException('Email và Password là bắt buộc');
    }

    // Payload cho JWT
    const payload = { email: user.email, id: user.id };

    // Tạo access_token
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      //privateKey: this.configService.get<string>('JWT_PRIVATE_KEY'),
      //algorithm: 'RS256', // Sử dụng RS256
      expiresIn: '15m', // Thiết lập thời gian hết hạn cho access token
    });

    // Tạo refresh_token
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      // privateKey: this.configService.get<string>('JWT_REFRESH_PRIVATE_KEY'),
      // algorithm: 'RS256',
      expiresIn: '7d',
    });

    // Lưu refresh_token vào cookies
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true, // Ngăn truy cập qua JavaScript
      secure: true, // Chỉ gửi qua HTTPS
      sameSite: 'strict', // Bảo vệ CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      path: '/', // Cookie áp dụng cho toàn bộ ứng dụng
    });

    return {
      user: {
        email: user.email,
        id: user.id,
        name: user.name,
      },
      access_token,
      refresh_token, // test thoi
    };
  }

  async handleRefreshToken(refresh_token: string) {
    try {
      //const publicKey = this.configService.get<string>('JWT_REFRESH_PUBLIC_KEY');
      // 1. Verify refresh token using JWT_REFRESH_SECRET
      const payload = await this.jwtService.verify(refresh_token, {
        // publicKey, // Dùng public key để xác minh
        // algorithms: ['RS256'],
        secret: this.configService.get('JWT_REFRESH_SECRET'), // Xác minh refresh token
      });

      // 2. Cấp lại access token
      const newAccessToken = this.jwtService.sign(payload, {
        // privateKey: this.configService.get<string>('JWT_PRIVATE_KEY'),
        // algorithm: 'RS256',
        secret: this.configService.get('JWT_SECRET'), // Xác minh access token
        expiresIn: '1d',
      });

      return { access_token: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(response: Response): Promise<void> {
    // Xóa refresh token trong cookie
    response.clearCookie('refresh_token', {
      httpOnly: true, // Ngăn truy cập qua JavaScript
      secure: true, // Chỉ gửi qua HTTPS
      sameSite: 'strict', // CSRF protection
      path: '/', // Cookie áp dụng cho toàn bộ ứng dụng
    });

    // Trả về trạng thái logout thành công
    response.json({ message: 'Logout successful' });
  }

  register = async (registerDto: CreateAuthDto) => {
    return await this.userService.handleRegister(registerDto);
  };

  checkCode = async (data: CodeAuthDto) => {
    return await this.userService.handleActive(data);
  };

  retryActive = async (data: string) => {
    return await this.userService.retryActive(data);
  };

  retryPassword = async (data: string) => {
    return await this.userService.retryPassword(data);
  };

  changePassword = async (data: ChangePasswordAuthDto) => {
    return await this.userService.changePassword(data);
  };
}
