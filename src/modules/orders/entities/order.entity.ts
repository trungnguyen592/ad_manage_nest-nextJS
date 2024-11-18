import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Restaurant } from '@/modules/restaurants/entities/restaurant.entity';
import { User } from '@/modules/users/entities/user.entity';
import { OrderDetail } from '@/modules/order.detail/entities/order.detail.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders, {
    onDelete: 'CASCADE',
  })
  //Là một trường trong entity Order dùng để lưu trữ thông tin về nhà hàng mà đơn hàng đó thuộc về.
  restaurant: Restaurant;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  details: OrderDetail[]; // Một đơn hàng có thể có nhiều chi tiết đơn hàng

  @Column({ type: 'varchar', length: 255 })
  status: string;

  @Column({ type: 'float' })
  totalPrice: number;

  @Column({ type: 'timestamp' })
  orderTime: Date;

  @Column({ type: 'timestamp' })
  deliveryTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
