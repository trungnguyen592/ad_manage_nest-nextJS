// src/data-source.ts
import { DataSource, DataSourceOptions } from 'typeorm';
import { resolve } from 'path';
import { User } from '@/modules/users/entities/user.entity';
import { Post } from '@/modules/post/entities/post.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'ADManage',
  password: '05092002',
  database: 'manager',
  entities: [User, Post], // Thêm các entity của bạn vào đây
  migrations: ['dist/src/migrations/**/*{.ts,.js}'], // Đường dẫn tới migrations
  synchronize: false, // Đặt là false khi đang làm việc với migrations
  logging: true, // Bật logging để theo dõi các truy vấn
};
console.log('first', dataSourceOptions.migrations);
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
