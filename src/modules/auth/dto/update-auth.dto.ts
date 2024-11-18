import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {}
// PartialType sẽ tạo một DTO mới với tất cả các thuộc tính từ CreateUserDto,
// nhưng mỗi thuộc tính sẽ trở thành tùy chọn (optional)
