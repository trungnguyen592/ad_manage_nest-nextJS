import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { ROLES } from 'src/common/enums/role.enum';
import { Post } from '@/modules/post/entities/post.entity';
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'full_name', type: 'varchar', nullable: true })
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Column({ type: 'varchar', nullable: true })
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

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Post, (post) => post.user, {
    onDelete: 'CASCADE',
  })
  posts: Post[]; // Một người dùng có thể có nhiều bai`
}
