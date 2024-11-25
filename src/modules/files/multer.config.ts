import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import fs from 'fs';
import { diskStorage } from 'multer';
import path, { join } from 'path';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory, OnModuleInit {
  //thư mục hiện tại mà ứng dụng đang chạy
  getRootPath = () => process.cwd();

  //kiểm tra public/image có chưa? => nó sẽ được tạo mới.
  ensureExists(targetDirectory: string) {
    try {
      if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory, { recursive: true });
        console.log('Directory successfully created at', targetDirectory);
      }
    } catch (error) {
      console.error('Error creating directory:', error);
    }
  }

  // Tự động tạo thư mục khi khởi động module
  onModuleInit() {
    const baseDirectory = join(this.getRootPath(), 'public/image');
    this.ensureExists(baseDirectory); // Tạo thư mục public/image nếu chưa có
  }

  //cấu hình cho Multer để xử lý file upload
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        // nơi file sẽ được lưu
        destination: (req, file, cb) => {
          const targetDirectory = join(this.getRootPath(), 'public/image');
          this.ensureExists(targetDirectory); // Đảm bảo thư mục tồn tại
          cb(null, targetDirectory);
        },

        //Đặt tên file tải lên
        filename: (req, file, cb) => {
          const extName = path.extname(file.originalname); //.jpg, .png
          const baseName = path.basename(file.originalname, extName);
          const finalName = `${baseName}-${Date.now()}${extName}`;
          cb(null, finalName);
        },
      }),
    };
  }
}
