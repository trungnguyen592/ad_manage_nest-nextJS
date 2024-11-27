import {
  BadRequestException,
  Inject,
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
import { ConfigService, ConfigType } from '@nestjs/config';
import refreshJwtConfig from '../../config/refresh-jwt.config';
import * as argon2 from 'argon2';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (!user) return null;

    const isValidPassword = await comparePasswordHelper(pass, user.password);
    if (!isValidPassword) return null;
    return user;
  }

  async login(user: Partial<User>) {
    if (!user.email || !user.password) {
      throw new BadRequestException('Hãy Nhập Email và Password');
    }

    const existingUser = await this.userService.findByEmail(user.email);
    if (!existingUser) {
      throw new BadRequestException('Email không tồn tại');
    }

    // Tiến hành xử lý login với email và password hợp lệ
    const { access_token, refresh_token } =
      await this.generateTokens(existingUser);
    const hashedRefreshToken = await argon2.hash(refresh_token);
    await this.userService.updateHashedRefreshToken(
      existingUser.id,
      hashedRefreshToken,
    );

    return {
      id: existingUser.id,
      email: existingUser.email,
      access_token,
      refresh_token, // chỉ dùng để kiểm tra
    };
  }

  async generateTokens(user: Partial<User>) {
    // Tạo payload từ email và id của user
    const payload = { email: user.email, id: user.id };

    // Tạo cả access_token và refresh_token đồng thời
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  async refreshToken(id: string) {
    // Lấy user từ cơ sở dữ liệu
    const user = await this.userService.findById(id); // Tìm user theo id
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }
    const { access_token, refresh_token } = await this.generateTokens(user);
    const hashedRefreshToken = await argon2.hash(refresh_token);
    await this.userService.updateHashedRefreshToken(id, hashedRefreshToken);
    return {
      id: id,
      access_token,
      refresh_token,
    };
  }

  async validateRefreshToken(id: string, refresh_token: string) {
    const user = await this.userService.findById(id);
    if (!user || !user.hashedRefreshToken)
      throw new UnauthorizedException('Invalid Refresh Token');

    const refreshTokenMatches = await argon2.verify(
      user.hashedRefreshToken,
      refresh_token,
    );
    if (!refreshTokenMatches)
      throw new UnauthorizedException('Invalid Refresh Token');

    return { id: id };
  }

  async logout(id: string) {
    await this.userService.updateHashedRefreshToken(id, null);
    return { message: 'Đăng xuất thành công' };
  }

  register = async (registerDto: CreateAuthDto) => {
    return await this.userService.handleRegister(registerDto);
  };

  // checkCode = async (data: CodeAuthDto) => {
  //   return await this.userService.handleActive(data);
  // };

  // retryActive = async (data: string) => {
  //   return await this.userService.retryActive(data);
  // };

  // retryPassword = async (data: string) => {
  //   return await this.userService.retryPassword(data);
  // };

  // changePassword = async (data: ChangePasswordAuthDto) => {
  //   return await this.userService.changePassword(data);
  // };
}
