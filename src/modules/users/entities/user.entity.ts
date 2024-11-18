import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ROLES } from 'src/common/enums/role.enum';
import { Order } from '@/modules/orders/entities/order.entity';
import { Review } from '@/modules/reviews/entities/review.entity';

@Entity({ name: 'users' }) // Tên bảng trong cơ sở dữ liệu
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

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[]; // Một người dùng có thể có nhiều đơn hàng

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
