import {
  BadRequestException,
  Injectable,
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
import { PaginationDto } from './dto/pagination.dto';
// import { ChangePasswordAuthDto, CodeAuthDto, CreateAuthDto } from '@/auth/dto/create-auth.dto';
// import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    // private readonly mailerService: MailerService,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
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
  async findAll(paginationDto: PaginationDto): Promise<User[]> {
    let { page, limit, sortBy, order } = paginationDto;

    // Đảm bảo page và limit là số hợp lệ
    page = isNaN(page) || page < 1 ? 1 : page;
    limit = isNaN(limit) || limit < 1 ? 10 : limit;

    // Đảm bảo sortBy và order hợp lệ
    sortBy = sortBy || 'id'; // Mặc định sắp xếp theo 'id'
    order = order === 'desc' ? 'desc' : 'asc'; // Mặc định là 'asc':Tăng dần, 'desc':Giảm dần

    const skip = (page - 1) * limit;

    return this.userRepository.find({
      skip,
      take: limit,
      order: {
        [sortBy]: order, // Sắp xếp theo trường sortBy và thứ tự order
      },
    });
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({ where: { id: id.toString() } });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updateuser = await this.findById(id);
    if (!updateuser) {
      throw new NotFoundException();
    }
    Object.assign(updateuser, updateUserDto); // Cập nhật thông tin thành phố với dữ liệu mới
    return await this.userRepository.save(updateuser);
  }

  async remove(id: string): Promise<void> {
    // Promise<void> không trả về giá trị cụ thể sau khi thực hiện thao tác xóa.
    const removeuser = await this.findById(id);
    if (!removeuser) {
      throw new NotFoundException();
    }
    await this.userRepository.remove(removeuser);
  }

  // async handleRegister(registerDto: CreateAuthDto) {
  //   const { name, email, password } = registerDto;

  //   // Check email
  //   const isExist = await this.isEmailExist(email);
  //   if (isExist) {
  //     throw new BadRequestException(
  //       `Email đã tồn tại: ${email}. Vui lòng sử dụng email khác.`,
  //     );
  //   }

  //   // Hash password
  //   const hashPassword = await hashPasswordHelper(password);
  //   const codeId = uuidv4();

  //   const user = this.userRepository.create({
  //     name,
  //     email,
  //     password: hashPassword,
  //     isActive: false,
  //     codeId,
  //     codeExpired: dayjs().add(5, 'minutes').toDate(),
  //   });
  //   await this.userRepository.save(user);

  //   // Send email
  //   await this.mailerService.sendMail({
  //     to: user.email,
  //     subject: 'Activate your account at @hoidanit',
  //     template: 'register',
  //     context: {
  //       name: user.name,
  //       activationCode: codeId,
  //     },
  //   });

  //   return { id: user.id };
  // }

  // async handleActive(data: CodeAuthDto) {
  //   const { id, code } = data;

  //   const user = await this.userRepository.findOne({
  //     where: { id, codeId: code },
  //   });
  //   if (!user) {
  //     throw new BadRequestException('Mã code không hợp lệ hoặc đã hết hạn');
  //   }

  //   if (dayjs().isBefore(user.codeExpired)) {
  //     user.isActive = true;
  //     await this.userRepository.save(user);
  //     return { isActivated: true };
  //   } else {
  //     throw new BadRequestException('Mã code không hợp lệ hoặc đã hết hạn');
  //   }
  // }

  // async retryActive(email: string) {
  //   const user = await this.userRepository.findOne({ where: { email } });
  //   if (!user) {
  //     throw new BadRequestException('Tài khoản không tồn tại');
  //   }
  //   if (user.isActive) {
  //     throw new BadRequestException('Tài khoản đã được kích hoạt');
  //   }

  //   const codeId = uuidv4();
  //   user.codeId = codeId;
  //   user.codeExpired = dayjs().add(5, 'minutes').toDate();
  //   await this.userRepository.save(user);

  //   await this.mailerService.sendMail({
  //     to: user.email,
  //     subject: 'Activate your account at @hoidanit',
  //     template: 'register',
  //     context: {
  //       name: user.name,
  //       activationCode: codeId,
  //     },
  //   });

  //   return { id: user.id };
  // }

  // async changePassword(data: ChangePasswordAuthDto) {
  //   const { email, password, confirmPassword } = data;

  //   if (password !== confirmPassword) {
  //     throw new BadRequestException(
  //       'Mật khẩu/xác nhận mật khẩu không chính xác.',
  //     );
  //   }

  //   const user = await this.userRepository.findOne({ where: { email } });
  //   if (!user) {
  //     throw new BadRequestException('Tài khoản không tồn tại');
  //   }

  //   if (dayjs().isBefore(user.codeExpired)) {
  //     user.password = await hashPasswordHelper(password);
  //     await this.userRepository.save(user);
  //     return { isPasswordChanged: true };
  //   } else {
  //     throw new BadRequestException('Mã code không hợp lệ hoặc đã hết hạn');
  //   }
  // }
}
