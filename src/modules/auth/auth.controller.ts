import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from '@/common/decorators/customize';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  // @ResponseMessage("Fetch login")
  Login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @Public()
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.register(registerDto);
  }

  @Get('mail')
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
  // @Public()
  // checkCode(@Body() registerDto: CodeAuthDto) {
  //   return this.authService.checkCode(registerDto);
  // }

  // @Post('retry-active')
  // @Public()
  // retryActive(@Body("email") email: string) {
  //   return this.authService.retryActive(email);
  // }

  // @Post('retry-password')
  // @Public()
  // retryPassword(@Body("email") email: string) {
  //   return this.authService.retryPassword(email);
  // }

  // @Post('change-password')
  // @Public()
  // changePassword(@Body() data: ChangePasswordAuthDto) {
  //   return this.authService.changePassword(data);
  // }
}
