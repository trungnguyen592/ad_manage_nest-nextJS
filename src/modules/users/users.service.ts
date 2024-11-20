import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { hashPasswordHelper } from '@/util/helper';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import aqp from 'api-query-params';
import {
  ChangePasswordAuthDto,
  CodeAuthDto,
  CreateAuthDto,
} from '../auth/dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      // withDeleted: true,  //Bao gồm cả bản ghi đã bị soft delete
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }

  async isEmailExist(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user !== null; // Trả về true nếu user tồn tại, false nếu không tồn tại
  }

  async create(createUserDto: CreateUserDto) {
    // Check email
    const isExist = await this.isEmailExist(createUserDto.email);
    if (isExist) {
      throw new BadRequestException('Email đã tồn tại');
    }

    // Hash password
    const hashedPassword = await hashPasswordHelper(createUserDto.password);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword, // Mật khẩu đã mã hóa
    });

    // Lưu người dùng vào cơ sở dữ liệu
    await this.userRepository.save(user);
    return {
      message: 'User Created',
      id: user.id,
    };
  }

  //Promise<User[] trả về một mảng ([]) các đối tượng User - ko có cũng dc nma ko biết được kiểu data gì trả về
  // async findAll(paginationDto: PaginationDto): Promise<User[]> {
  //   let { page, limit, sortBy, order } = paginationDto;

  //   // Đảm bảo page và limit là số hợp lệ
  //   page = isNaN(page) || page < 1 ? 1 : page;
  //   limit = isNaN(limit) || limit < 1 ? 10 : limit;

  //   // Đảm bảo sortBy và order hợp lệ
  //   sortBy = sortBy || 'id'; // Mặc định sắp xếp theo 'id'
  //   order = order === 'desc' ? 'desc' : 'asc'; // Mặc định là 'asc':Tăng dần, 'desc':Giảm dần

  //   const skip = (page - 1) * limit;

  //   return this.userRepository.find({
  //     skip,
  //     take: limit,
  //     order: {
  //       [sortBy]: order, // Sắp xếp theo trường sortBy và thứ tự order
  //     },
  //   });
  // }
  async findAll(query: string, current: number, pageSize: number) {
    //aqp(query) là một thư viện giúp phân tích chuỗi query string thành các đối tượng filter (điều kiện lọc) và sort (sắp xếp).
    const { filter, sort } = aqp(query);
    //Nếu filter chứa các tham số current và pageSize => loại vì không phải là điều kiện lọc trong db mà chỉ liên quan đến phân trang.
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (current < 1 || isNaN(current)) current = 1; // Đảm bảo current luôn >= 1
    if (pageSize < 1 || isNaN(pageSize)) pageSize = 5; // Đảm bảo pageSize luôn >= 1

    // ko sài find vì find lấy all data và chỉ đếm số lượng => ko tối ưu
    const totalItems = await this.userRepository.count({
      where: filter,
      // withDeleted: true, // Bao gồm cả các bản ghi đã bị xóa mềm
    });
    const totalPages = Math.ceil(totalItems / pageSize);

    //skip: Là số bản ghi cần bỏ qua để đến trang hiện tại.
    //Ví dụ, trang 3 và trang có 10 bản ghi, bạn cần bỏ qua (3 - 1) * 10 = 20 bản ghi đầu tiên.
    const skip = (current - 1) * pageSize;

    const results = await this.userRepository.find({
      where: filter, // Điều kiện lọc
      take: pageSize, // Số lượng bản ghi cần lấy
      skip: skip, // Bỏ qua số bản ghi đã được tính toán
      order: sort as any, // Điều kiện sắp xếp
      // withDeleted: true, // Bao gồm cả bản ghi đã bị soft delete
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

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      //withDeleted: true,  //Bao gồm cả bản ghi đã bị soft delete
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    // Kiểm tra xem người dùng có tồn tại với id này không
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Cập nhật các thuộc tính của user với updateUserDto
    Object.assign(user, updateUserDto);

    // Lưu thông tin người dùng đã cập nhật
    return await this.userRepository.save(user);
  }

  // async deleteUser(id: string) {
  //   // Xóa mềm
  //   await this.userRepository.softDelete(id);
  // }

  async remove(id: string): Promise<void> {
    // Promise<void> không trả về giá trị cụ thể sau khi thực hiện thao tác xóa.
    const removeuser = await this.findById(id);
    if (!removeuser) {
      throw new NotFoundException();
    }
    await this.userRepository.remove(removeuser);
  }

  async restoreUser(id: string) {
    // Khôi phục user đã xóa
    await this.userRepository.restore(id);
  }

  async handleRegister(registerDto: CreateAuthDto) {
    // Check email
    const isExist = await this.isEmailExist(registerDto.email);
    if (isExist) {
      throw new BadRequestException(
        `Email đã tồn tại. Vui lòng sử dụng email khác.`,
      );
    }

    // Hash password
    const hashPassword = await hashPasswordHelper(registerDto.password);

    // Kiểu dúng cccd, sau dùng để kích hoạt tk, đặt lại mk,...
    const codeId = uuidv4();

    const user = this.userRepository.create({
      ...registerDto,
      password: hashPassword, // Mật khẩu đã mã hóa
      isActive: false,
      codeId,
      codeExpired: dayjs().add(5, 'minutes').toDate(),
    });

    await this.userRepository.save(user);

    // Send email
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Activate your account at @itochannel',
        template: 'register',
        context: {
          name: user.name ?? user.email,
          activationCode: codeId,
        },
      });
      console.log(`Email sent to ${user.email}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new InternalServerErrorException('Email sending failed');
    }

    return {
      message: 'Đăng Ký Thành Kông',
      id: user.id,
    };
  }

  async handleActive(codeAuthDto: CodeAuthDto) {
    const { id, code } = codeAuthDto;

    const user = await this.userRepository.findOne({
      where: { id, codeId: code },
    });
    if (!user) {
      throw new BadRequestException('Mã code không hợp lệ hoặc đã hết hạn');
    }

    //Kiểm tra thời gian hết hạn của mã
    if (dayjs().isBefore(user.codeExpired)) {
      user.isActive = true;
      await this.userRepository.save(user);
      console.log('User activated successfully', user);
      return { isActivated: true };
    } else {
      throw new BadRequestException('Mã code đã hết hạn');
    }
  }

  async retryActive(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }
    if (user.isActive) {
      throw new BadRequestException('Tài khoản đã được kích hoạt');
    }

    const codeId = uuidv4();
    user.codeId = codeId;
    user.codeExpired = dayjs().add(5, 'minutes').toDate();
    await this.userRepository.save(user);
    //Gửi email kích hoạt mới
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Activate your account at @itochannel',
        template: 'register',
        context: {
          name: user.name,
          activationCode: codeId,
        },
      });
      console.log(`Email sent to ${user.email}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new InternalServerErrorException('Email sending failed');
    }

    return { id: user.id };
  }

  async retryPassword(email: string) {
    // Kiểm tra email
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }

    // Tạo mã kích hoạt mới
    const codeId = uuidv4();

    // Cập nhật thông tin người dùng
    user.codeId = codeId;
    user.codeExpired = dayjs().add(5, 'minutes').toDate();

    await this.userRepository.save(user);

    // Gửi email
    await this.mailerService.sendMail({
      to: user.email, // người nhận
      subject: 'Change your password account at @itochannel', // tiêu đề email
      template: 'register', // template email
      context: {
        name: user.name ?? user.email, // tên người dùng hoặc email
        activationCode: codeId, // mã kích hoạt
      },
    });

    return { id: user.id, email: user.email };
  }

  async changePassword(data: ChangePasswordAuthDto) {
    const { email, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      throw new BadRequestException(
        'Mật khẩu/xác nhận mật khẩu không chính xác.',
      );
    }

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }

    if (dayjs().isBefore(user.codeExpired)) {
      user.password = await hashPasswordHelper(password);
      await this.userRepository.save(user);
      return { isPasswordChanged: true };
    } else {
      throw new BadRequestException('Mã code không hợp lệ hoặc đã hết hạn');
    }
  }
}
