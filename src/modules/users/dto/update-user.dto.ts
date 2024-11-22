import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'ID người dùng', example: '12345' })
  @IsOptional()
  id: string;

  @ApiPropertyOptional({
    description: 'Tên người dùng',
    example: 'Trung Nguyn',
  })
  @IsOptional()
  name: string;

  @ApiPropertyOptional({
    description: 'Số điện thoại người dùng',
    example: '0916713796',
  })
  @IsOptional()
  phone: string;

  @ApiPropertyOptional({
    description: 'Địa chỉ của người dùng',
    example: 'Da Nang City',
  })
  @IsOptional()
  address: string;
}
