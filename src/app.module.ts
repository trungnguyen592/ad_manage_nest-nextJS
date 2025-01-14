import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { User } from './modules/users/entities/user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth/jwt-auth.guard';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { TransformInterceptor } from './common/core/transform.interceptor';
import { PostModule } from './modules/post/post.module';
import { Post } from './modules/post/entities/post.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { FileModule } from './modules/files/file.module';
import { dataSourceOptions } from 'db/data-source';

@Module({
  imports: [
    // ThrottlerModule.forRoot({
    //   timeToLive: 60, // Thời gian lưu lại số request (60 giây)
    //   limit: 10, // Tối đa 10 requests trong 60 giây
    // }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com', //máy chủ SMTP của Gmail
          port: 465, //gửi email qua kết nối bảo mật
          secure: true,
          // ignoreTLS: true,
          // secure: false, //nếu máy chủ chặn port 465 chạy port 587
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        //preview: true,
        template: {
          dir: process.cwd() + '/src/mail/templates/',
          adapter: new HandlebarsAdapter(), //biên dịch template thành HTML.
          options: {
            strict: true, //bất kỳ lỗi nào trong quá trình biên dịch (ví dụ: thiếu biến) sẽ gây ra lỗi ngay lập tức.
          },
        },
      }),
      inject: [ConfigService],
    }),
    PostModule,
    UsersModule,
    AuthModule,
    FileModule,

    //TypeOrmModule.forFeature([Post]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD, //global guard cho all route: kiểu như đặt guard cho toàn bộ modules, nếu ko có UseGuards => bắn lỗi bên JwtAuthGuard
      useClass: JwtAuthGuard, //
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
