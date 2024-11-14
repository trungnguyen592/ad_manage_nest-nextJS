import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ROLES } from 'src/common/enums/role.enum';

@Entity({ name: 'users' }) // Tên bảng trong cơ sở dữ liệu
export class User {
  @PrimaryGeneratedColumn('uuid') // Primary Key, sử dụng kiểu uuid
  id: string;

  @Column({ name: 'full_name', type: 'varchar', nullable: true })
  fullName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  image: string;

  @Column({ default: ROLES.USER })
  role: string;

  @Column({ default: 'LOCAL' })
  accountType: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true })
  codeId: string;

  @Column({ nullable: true, type: 'timestamp' })
  codeExpired: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
