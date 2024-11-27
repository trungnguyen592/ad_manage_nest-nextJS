import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  NotFoundException,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { ROLES } from '@/common/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Users') // Tên nhóm trong Swagger
@Controller('users')
// @UseGuards(RolesGuard)
// @Roles(ROLES.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo người dùng mới' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách người dùng' })
  async findAll(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.usersService.findAll(query, +current, +pageSize);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Tìm người dùng theo ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get(':email')
  @ApiOperation({ summary: 'Tìm người dùng theo Email' })
  findEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập Nhật người dùng theo ID' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa người dùng' })
  async remove(@Param('id') id: string): Promise<any> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }
    await this.usersService.remove(id);
    return { message: 'User deleted successfully' };
  }

  @Post(':id/upload-avatar')
  @UseInterceptors(FileInterceptor('fileUpload'))
  async uploadAvatar(
    @Param('id') id: string, // Lấy userId từ URL
    @UploadedFile() file: Express.Multer.File, // Lấy file tải lên
  ) {
    // Kiểm tra nếu file tải lên không hợp lệ
    if (!file) {
      return {
        message: 'No file uploaded',
      };
    }

    const filePath = `public/image/${file.filename}`; // Đường dẫn lưu ảnh

    // Cập nhật ảnh cho người dùng trong cơ sở dữ liệu
    const updatedUser = await this.usersService.updateUserImage(id, filePath);

    return {
      message: 'File uploaded successfully',
      user: updatedUser, // Trả về thông tin người dùng với ảnh đã được cập nhật
      filePath,
    };
  }
}
