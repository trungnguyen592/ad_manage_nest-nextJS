import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './guards/strategies/local.strategy';
import { JwtStrategy } from './guards/strategies/jwt.strategy';
import { PostModule } from '../post/post.module';
import jwtConfig from '../../config/jwt.config';
import refreshJwtConfig from '../../config/refresh-jwt.config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { TransformInterceptor } from '@/common/core/transform.interceptor';
import { RefreshJwtStrategy } from './guards/strategies/refresh.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    PostModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
    {
      provide: APP_GUARD, //global guard cho all route: kiểu như đặt guard cho toàn bộ modules, nếu ko có UseGuards => bắn lỗi bên JwtAuthGuard
      useClass: JwtAuthGuard, //
    },
  ],
})
export class AuthModule {}
