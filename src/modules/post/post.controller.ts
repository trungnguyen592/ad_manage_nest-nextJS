import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Public } from '@/common/decorators/customize';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @Public()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  @Public()
  findAll(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.postService.findAll(query, +current, +pageSize);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.postService.findById(id);
  }

  @Patch(':id')
  @Public()
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdatePostDto,
  ): Promise<any> {
    await this.postService.update(id, updateUserDto);
    return { message: 'Post updated successfully' };
  }

  @Delete(':id')
  @Public()
  async softDelete(@Param('id') id: string): Promise<any> {
    await this.postService.deletePost(id);
    return { message: 'Post deleted successfully' };
  }

  @Delete('deleted/:id')
  async remove(@Param('id') id: string): Promise<any> {
    const post = await this.postService.findById(id);
    if (!post) {
      throw new NotFoundException('Post do not exist!');
    }
    await this.postService.remove(id);
    return { message: 'Post deleted successfully' };
  }

  @Patch('restore/:id')
  @Public()
  async restorePost(@Param('id') id: string) {
    await this.postService.restorePost(id);
    return { message: 'Post restored successfully!!!' };
  }
}
