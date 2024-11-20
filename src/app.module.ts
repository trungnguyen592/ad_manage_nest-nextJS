import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { User } from './modules/users/entities/user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { TransformInterceptor } from './common/core/transform.interceptor';
import { PostModule } from './modules/post/post.module';
import { Post } from './modules/post/entities/post.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Post],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
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
