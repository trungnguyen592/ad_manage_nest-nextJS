import { Module } from '@nestjs/common';

import { FileController } from './file.controller';
import { MulterConfigService } from './multer.config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    //tải file từ nguồn bên ngoài.
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [FileController],
  providers: [],
})
export class FileModule {}
