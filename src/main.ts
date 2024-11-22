import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './common/core/transform.interceptor';
import { ThrottlerGuard } from '@nestjs/throttler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  // // Kích hoạt ThrottlerGuard cho toàn bộ ứng dụng
  // app.useGlobalGuards(new ThrottlerGuard());

  // Kích hoạt Interceptors cho toàn bộ ứng dụng
  app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));
  // Cấu hình CORS
  app.enableCors({
    origin: 'http://localhost:3000', // Thay đổi với URL của frontend nếu cần
    methods: 'GET, POST, PATCH, PUT, DELETE', // Các phương thức HTTP cho phép
    allowedHeaders: 'Content-Type, Authorization', // Các header cho phép
  });

  // Cấu hình global prefix cho API
  app.setGlobalPrefix('api/v1', { exclude: [''] });

  // Cấu hình ValidationPipe cho dữ liệu đầu vào
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Loại bỏ các thuộc tính không xác định trong DTO.
      forbidNonWhitelisted: true, // Ném lỗi nếu request chứa bất kỳ thuộc tính nào không xác định trong DTO.
    }),
  );

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('API NestJS & PostgreSQL')
    .setDescription('API For Admin Managements Project')
    .setVersion('1.0')
    .addBearerAuth() // Thêm xác thực Bearer Token nếu cần
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Khởi động server
  await app.listen(port, () => {
    console.log('Server is running on port: ' + port);
  });
}
bootstrap();
