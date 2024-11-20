import { IsNotEmpty, IsOptional, Length, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @Length(10, 100)
  title: string;

  @IsOptional()
  @MaxLength(500, { message: 'Mô tả không được vượt quá 500 ký tự' })
  descriptions: string;
}
