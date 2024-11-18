import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { User } from './modules/users/entities/user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { LikesModule } from './modules/likes/likes.module';
import { MenuItemModule } from './modules/menu.item/menu.item.module';
import { MenuItemOptionsModule } from './modules/menu.item.options/menu.item.options.module';
import { MenusModule } from './modules/menus/menus.module';
import { OrderDetailModule } from './modules/order.detail/order.detail.module';
import { OrdersModule } from './modules/orders/orders.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { MenuItemOption } from './modules/menu.item.options/entities/menu.item.option.entity';
import { MenuItem } from './modules/menu.item/entities/menu.item.entity';
import { OrderDetail } from './modules/order.detail/entities/order.detail.entity';
import { Order } from './modules/orders/entities/order.entity';
import { Restaurant } from './modules/restaurants/entities/restaurant.entity';
import { Review } from './modules/reviews/entities/review.entity';
import { Like } from './modules/likes/entities/like.entity';
import { Menu } from './modules/menus/entities/menu.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          User,
          Like,
          Menu,
          MenuItem,
          MenuItemOption,
          Order,
          OrderDetail,
          Restaurant,
          Review,
        ],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    UsersModule,
    AuthModule,
    LikesModule,
    MenuItemModule,
    MenuItemOptionsModule,
    MenusModule,
    OrderDetailModule,
    OrdersModule,
    RestaurantsModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
