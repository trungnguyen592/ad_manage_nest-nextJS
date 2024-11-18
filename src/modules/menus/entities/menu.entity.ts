import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany, // Thêm decorator OneToMany
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Restaurant } from '@/modules/restaurants/entities/restaurant.entity';
import { MenuItem } from '@/modules/menu.item/entities/menu.item.entity';
import { OrderDetail } from '@/modules/order.detail/entities/order.detail.entity';

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menus, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Thêm quan hệ OneToMany với MenuItem
  @OneToMany(() => MenuItem, (menuItem) => menuItem.menu)
  items: MenuItem[];

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  details: OrderDetail[];
}
