import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public, ResponseMessage } from 'src/common/decorators/customize';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Upload Files')
@Controller('file')
export class FileController {
  @Public()
  @Post('upload')
  @UseInterceptors(FileInterceptor('fileUpload'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder() //Giới hạn loại file & size khi tải lên
        .addFileTypeValidator({
          fileType:
            /^(jpg|image\/jpeg|image\/png|text\/plain|txt|docx|doc|application\/pdf|gif)$/i,
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File, //xử lý tệp tải lên
  ) {
    console.log('Uploaded file:', file); // In thông tin file đã upload
    return {
      message: 'File uploaded successfully',
      fileName: file.filename,
      filePath: `public/image/${file.filename}`, // Log đường dẫn nơi file lưu
    };
  }
}
