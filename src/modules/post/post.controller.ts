import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  NotFoundException,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Public } from '@/common/decorators/public.decorator';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

// @UseGuards(ThrottlerGuard) // Bật guard cho controller
@ApiTags('Post') // Tên nhóm trong Swagger
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo Post' })
  @UseGuards(JwtAuthGuard)
  create(@Body() createPostDto: CreatePostDto, @Request() req) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    const user = req.user;
    return this.postService.create(createPostDto, user);
  }

  @Get()
  // @Throttle(5, 60) // 5 requests trong 60 giây
  @ApiOperation({ summary: 'Tìm Tất Cả Post' })
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.postService.findAll(query, +current, +pageSize);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Tìm Post Theo ID' })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.postService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập Nhật Post' })
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdatePostDto,
    @Request() req,
  ): Promise<any> {
    const user = req.user;
    console.log('user', req.user);
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }
    await this.postService.update(id, updateUserDto, user);
    return { message: 'Post updated successfully' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa Post - Mềm' })
  @UseGuards(JwtAuthGuard)
  async softDelete(@Param('id') id: string): Promise<any> {
    await this.postService.deletePost(id);
    return { message: 'Post deleted successfully' };
  }

  @Delete('deleted/:id')
  @ApiOperation({ summary: 'Xóa Post - Cứng' })
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string): Promise<any> {
    const post = await this.postService.findById(id);
    if (!post) {
      throw new NotFoundException('Post do not exist!');
    }
    await this.postService.remove(id);
    return { message: 'Post deleted successfully' };
  }

  @Patch('restore/:id')
  @ApiOperation({ summary: 'Khôi phục Post' })
  @UseGuards(JwtAuthGuard)
  async restorePost(@Param('id') id: string) {
    await this.postService.restorePost(id);
    return { message: 'Post restored successfully!!!' };
  }
}
