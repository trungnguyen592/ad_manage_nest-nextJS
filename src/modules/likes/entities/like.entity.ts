import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Restaurant } from '@/modules/restaurants/entities/restaurant.entity';

@Entity('likes')
export class Like {
  // Universally Unique Identifier, mỗi bản ghi sẽ có một giá trị ID duy nhất, thay vì các số nguyên tăng dần.
  @PrimaryGeneratedColumn('uuid')
  id: string;

  //mỗi Like liên kết đến một Restaurant, và khi xóa một Restaurant, tất cả Like liên quan sẽ bị xóa theo.
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.likes, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
