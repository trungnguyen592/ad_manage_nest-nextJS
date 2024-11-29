import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
  Response,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ChangePasswordAuthDto,
  CodeAuthDto,
  CreateAuthDto,
} from './dto/create-auth.dto';
import { LocalAuthGuard } from './guards/local-refresh auth/local-auth.guard';
import { Public, ResponseMessage } from '@/common/decorators/public.decorator';
import { MailerService } from '@nestjs-modules/mailer';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RefreshAuthGuard } from './guards/local-refresh auth/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';

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
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Fetch login')
  Login(@Request() req) {
    return this.authService.login(req.body);
  }

  @Post('register')
  @ApiOperation({ summary: 'Đăng Ký' })
  @Public()
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.register(registerDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req) {
    const user = req.user; // Người dùng đã được xác thực
    if (!user || !user.id) {
      throw new UnauthorizedException('Không tìm thấy thông tin người dùng');
    }
    // Thực hiện logic logout
    return this.authService.logout(user.id);
  }

  @UseGuards(RefreshAuthGuard)
  @Public()
  @Post('refresh')
  refreshToken(@Req() req) {
    return this.authService.refreshToken(req.user.id);
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

  // @Post('check-code')
  // @ApiOperation({ summary: 'Check Code Active' })
  // @Public()
  // checkCode(@Body() registerDto: CodeAuthDto) {
  //   return this.authService.checkCode(registerDto);
  // }

  // @Post('retry-active')
  // @ApiOperation({ summary: 'Gửi Lại Code Active' })
  // @Public()
  // retryActive(@Body('email') email: string) {
  //   return this.authService.retryActive(email);
  // }

  // @Post('retry-password')
  // @ApiOperation({ summary: 'Gửi Lại Code Active Pass' })
  // @Public()
  // retryPassword(@Body('email') email: string) {
  //   return this.authService.retryPassword(email);
  // }

  // @Post('change-password')
  // @ApiOperation({ summary: 'Đổi Pass' })
  // @Public()
  // changePassword(@Body() data: ChangePasswordAuthDto) {
  //   return this.authService.changePassword(data);
  // }
}
