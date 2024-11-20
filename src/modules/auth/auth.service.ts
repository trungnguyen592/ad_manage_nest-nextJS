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
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePasswordHelper } from '@/util/helper';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (!user) return null;

    const isValidPassword = await comparePasswordHelper(pass, user.password);
    if (!isValidPassword) return null;
    return user;
  }

  async login(user: Partial<User>) {
    // Kiểm tra nếu email và id không tồn tại
    if (!user.email || !user.id) {
      throw new BadRequestException('Email và ID là bắt buộc');
    }

    // Payload cho JWT
    const payload = { email: user.email, id: user.id };

    return {
      user: {
        email: user.email,
        id: user.id,
        name: user.name,
      },
      // Tạo access_token
      access_token: this.jwtService.sign(payload),
    };
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
