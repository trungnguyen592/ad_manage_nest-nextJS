import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
  Response,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ChangePasswordAuthDto,
  CodeAuthDto,
  CreateAuthDto,
} from './dto/create-auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public, ResponseMessage } from '@/common/decorators/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth') // Tên nhóm trong Swagger
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('login')
  @ApiBody({
    description: 'Thông tin đăng nhập',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@gmail.com' },
        password: { type: 'string', example: '12345' },
      },
      required: ['email', 'password'],
    },
  })
  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Fetch login')
  Login(@Request() req, @Response() res) {
    return this.authService.login(req.user, res);
  }

  @Post('register')
  @ApiOperation({ summary: 'Đăng Ký' })
  @Public()
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.register(registerDto);
  }

  @Post('logout')
  async logout(@Response() res): Promise<void> {
    return this.authService.logout(res);
  }

  @Post('refresh-token')
  async refreshToken(@Request() req, @Response() res) {
    // 1. Lấy refresh token từ cookie hoặc body
    const refreshToken = req.cookies['refresh_token'] || req.body.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      // 2. Gọi service để cấp lại access token
      const result = await this.authService.handleRefreshToken(refreshToken);

      // 3. Trả về access token mới
      return res.json(result);
    } catch (error) {
      throw new UnauthorizedException('Failed to refresh token');
    }
  }

  @Get('mail')
  @ApiOperation({ summary: 'Check Feature EMail' })
  @Public()
  testMail() {
    this.mailerService.sendMail({
      to: 'pokiwar192@gmail.com', // ng nhận
      subject: 'Testing MailerModule ✔', // Tiêu đề
      text: 'Tôi là J97', // nội dung
      template: 'register',
      context: {
        name: 'DongDong',
        activationCode: 123456789,
      },
    });
    return 'ok';
  }

  @Post('check-code')
  @ApiOperation({ summary: 'Check Code Active' })
  @Public()
  checkCode(@Body() registerDto: CodeAuthDto) {
    return this.authService.checkCode(registerDto);
  }

  @Post('retry-active')
  @ApiOperation({ summary: 'Gửi Lại Code Active' })
  @Public()
  retryActive(@Body('email') email: string) {
    return this.authService.retryActive(email);
  }

  @Post('retry-password')
  @ApiOperation({ summary: 'Gửi Lại Code Active Pass' })
  @Public()
  retryPassword(@Body('email') email: string) {
    return this.authService.retryPassword(email);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Đổi Pass' })
  @Public()
  changePassword(@Body() data: ChangePasswordAuthDto) {
    return this.authService.changePassword(data);
  }
}
