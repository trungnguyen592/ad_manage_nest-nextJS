import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MenuItemOption } from '@/modules/menu.item.options/entities/menu.item.option.entity';
import { MenuItem } from '@/modules/menu.item/entities/menu.item.entity';
import { Menu } from '@/modules/menus/entities/menu.entity';
import { Order } from '@/modules/orders/entities/order.entity';

@Entity('order_details')
export class OrderDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.details, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Menu, (menu) => menu.details, { onDelete: 'CASCADE' })
  menu: Menu;

  @ManyToOne(() => MenuItem, (menuItem) => menuItem.orderDetails, {
    onDelete: 'CASCADE',
  })
  menuItem: MenuItem;

  @ManyToOne(() => MenuItemOption, (option) => option.orderDetails, {
    onDelete: 'CASCADE',
  })
  menuItemOption: MenuItemOption;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
