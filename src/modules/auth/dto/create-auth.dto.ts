import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({
    description: 'Email của người dùng',
    example: 'user@example.com',
  })
  @IsNotEmpty({ message: 'email không được để trống' })
  email: string;

  @ApiProperty({
    description: 'Mật khẩu của người dùng',
    example: 'password123',
  })
  @IsNotEmpty({ message: 'password không được để trống' })
  password: string;

  @ApiPropertyOptional({
    description: 'Tên của người dùng',
    example: 'Trung Nguyn',
  })
  @IsOptional()
  name: string;
}

export class LoginDto {
  @ApiProperty({
    description: 'Email của người dùng',
    example: 'user@example.com',
  })
  @IsNotEmpty({ message: 'email không được để trống' })
  email: string;

  @ApiProperty({
    description: 'Mật khẩu của người dùng',
    example: 'password123',
  })
  @IsNotEmpty({ message: 'password không được để trống' })
  password: string;
}

export class CodeAuthDto {
  @ApiProperty({ description: 'ID Code', example: '12345' })
  @IsNotEmpty({ message: 'id không được để trống' })
  id: string;

  @ApiProperty({ description: 'Mã xác thực', example: 'A1B2C3' })
  @IsNotEmpty({ message: 'code không được để trống' })
  code: string;
}

export class ChangePasswordAuthDto {
  @ApiProperty({ description: 'Mã xác thực', example: 'A1B2C3' })
  @IsNotEmpty({ message: 'code không được để trống' })
  code: string;

  @ApiProperty({ description: 'Mật khẩu mới', example: 'newpassword123' })
  @IsNotEmpty({ message: 'password không được để trống' })
  password: string;

  @ApiProperty({
    description: 'Xác nhận mật khẩu mới',
    example: 'newpassword123',
  })
  @IsNotEmpty({ message: 'confirmPassword không được để trống' })
  confirmPassword: string;

  @ApiProperty({
    description: 'Email của người dùng',
    example: 'user@example.com',
  })
  @IsNotEmpty({ message: 'email không được để trống' })
  email: string;
}
