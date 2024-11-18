import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany, // Thêm decorator OneToMany
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Menu } from '@/modules/menus/entities/menu.entity';
import { MenuItemOption } from '@/modules/menu.item.options/entities/menu.item.option.entity';
import { OrderDetail } from '@/modules/order.detail/entities/order.detail.entity';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Menu, (menu) => menu.items, { onDelete: 'CASCADE' })
  menu: Menu;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'float', default: 0 })
  basePrice: number;

  @Column({ type: 'varchar', length: 255 })
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Thêm quan hệ OneToMany với MenuItemOption
  @OneToMany(() => MenuItemOption, (option) => option.menuItem)
  options: MenuItemOption[];

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetail[];
}
