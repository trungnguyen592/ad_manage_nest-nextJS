import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import aqp from 'api-query-params';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const post = this.postRepository.create(createPostDto);
    await this.postRepository.save(post);
    return {
      message: 'Post Created',
    };
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    if (current < 1 || isNaN(current)) current = 1; // Đảm bảo current luôn >= 1
    if (pageSize < 1 || isNaN(pageSize)) pageSize = 5; // Đảm bảo pageSize luôn >= 1
    const totalItems = await this.postRepository.count({
      where: filter,
    });
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;
    const results = await this.postRepository.find({
      where: filter, // Điều kiện lọc
      take: pageSize, // Số lượng bản ghi cần lấy
      skip: skip, // Bỏ qua số bản ghi đã được tính toán
      order: sort as any, // Điều kiện sắp xếp
    });
    return {
      meta: {
        current: current, //trang hiện tại
        pageSize: pageSize, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      results, //kết quả query
    };
  }

  async findById(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      withDeleted: true, //Bao gồm cả bản ghi đã bị soft delete
    });
    if (!post) {
      throw new NotFoundException('Post Not Found');
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findById(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Nếu bài viết đã bị xóa mềm, không cho phép cập nhật
    if (post.deletedAt) {
      throw new BadRequestException('Cannot update a deleted post');
    }

    // Cập nhật bài viết với dữ liệu mới
    Object.assign(post, updatePostDto);

    // Lưu bài viết đã cập nhật vào cơ sở dữ liệu
    return await this.postRepository.save(post);
  }

  async remove(id: string): Promise<void> {
    const removepost = await this.findById(id);
    if (!removepost) {
      throw new NotFoundException();
    }
    await this.postRepository.remove(removepost);
  }

  async deletePost(id: string) {
    // Xóa mềm
    await this.postRepository.softDelete(id);
  }

  async restorePost(id: string) {
    // Tìm bài viết theo ID
    const post = await this.postRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Kiểm tra nếu bài viết đã được khôi phục (deletedAt là null)
    if (!post.deletedAt) {
      throw new BadRequestException('Post has already been restored');
    }

    // Nếu bài viết đã bị xóa mềm, khôi phục lại
    post.deletedAt = null; // Đặt lại deletedAt về null
    await this.postRepository.save(post);
    return {
      message: 'Post Restored Success!!!',
    };
  }
}
