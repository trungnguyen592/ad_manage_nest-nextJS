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
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { ROLES } from '@/common/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterConfigService } from '../files/multer.config';

@ApiTags('Users') // Tên nhóm trong Swagger
@Controller('users')
// @UseGuards(RolesGuard)
@Roles(ROLES.ADMIN)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(MulterConfigService)
    private readonly multerConfigService: MulterConfigService, // Config Multer
  ) {}

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

  @Post('upload-avatar')
  @UseInterceptors(FilesInterceptor('image', 5))
  async uploadAvatar(
    @Req() req,
    @UploadedFile() file: Express.Multer.File, // Lấy file tải lên
  ) {
    if (!file) {
      throw new HttpException(
        'No file uploaded or invalid file type',
        HttpStatus.BAD_REQUEST,
      );
    }
    const filePath = file.path; // Đường dẫn lưu ảnh
    try {
      // Gọi service để cập nhật ảnh cho người dùng
      const updatedUser = await this.usersService.updateUserImage(
        req.user.id,
        filePath,
      );

      return {
        message: 'Avatar uploaded successfully',
        user: updatedUser, // Trả về thông tin người dùng với ảnh đã được cập nhật
        filePath,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to update user avatar',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
