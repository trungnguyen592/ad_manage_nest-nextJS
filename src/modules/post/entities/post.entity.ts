import { User } from '@/modules/users/entities/user.entity';

import { IsNotEmpty, IsOptional } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  DeleteDateColumn,
} from 'typeorm';
@Entity('post')
export class Post {
  @PrimaryGeneratedColumn()
  id: string;

  @IsNotEmpty()
  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @Column({
    name: 'descriptions',
    type: 'varchar',
    nullable: true,
  })
  @IsOptional()
  descriptions: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;
  //onDelete: 'SET NULL' nếu không muốn xóa bài viết
}
