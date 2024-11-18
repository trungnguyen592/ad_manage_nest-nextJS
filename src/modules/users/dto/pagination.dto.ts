import { IsOptional, IsNumber, Min, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => (value ? Number(value) : 1)) // Chuyển đổi thành số nếu là chuỗi
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => (value ? Number(value) : 10)) // Chuyển đổi thành số nếu là chuỗi
  limit: number = 10;

  @IsOptional()
  @IsString()
  sortBy: string = 'id'; // Trường sắp xếp (ví dụ: 'name', 'email', v.v.)

  @IsOptional()
  @IsString()
  order: 'asc' | 'desc' = 'asc'; // Thứ tự sắp xếp (mặc định là 'asc')
}
