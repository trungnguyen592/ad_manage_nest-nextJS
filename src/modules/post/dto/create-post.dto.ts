import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Length, MaxLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'Tiêu Đề Bài Post' })
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @Length(10, 100)
  title: string;

  @ApiProperty({ description: 'Mô Tả Bài Post' })
  @IsOptional()
  @MaxLength(500, { message: 'Mô tả không được vượt quá 500 ký tự' })
  descriptions: string;
}
