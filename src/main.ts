import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  app.setGlobalPrefix('api/v1', { exclude: [''] });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Loại bỏ các thuộc tính không xác định trong DTO.
      forbidNonWhitelisted: true, //Ném lỗi nếu request chứa bất kỳ thuộc tính nào không xác định trong DTO.
    }), //chỉ những dữ liệu hợp lệ (theo DTO) được chấp nhận trong các request
  );

  await app.listen(port);
}
bootstrap();
