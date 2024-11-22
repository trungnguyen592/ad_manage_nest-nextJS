import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Tên của người dùng' })
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @ApiProperty({
    description: 'Email của người dùng',
    example: 'user@example.com',
  })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @ApiProperty({ description: 'Mật khẩu người dùng', example: '123456' })
  @IsNotEmpty({ message: 'Password không được để trống' })
  password: string;

  phone: string;
  address: string;
  image: string;
}
