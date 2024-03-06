import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpaceModule } from './space/space.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceModel } from './space/entities/space.entity';
import { ConfigModule } from '@nestjs/config';
import { ENV_DB_DATABASE_KEY, ENV_DB_HOST_KEY, ENV_DB_PASSWORD_KEY, ENV_DB_PORT_KEY, ENV_DB_USERNAME_KEY } from './common/const/env-keys.const';
import { UserModule } from './user/user.module';
import { UserModel } from './user/entities/user.entity';
import { SpaceUserBridgeModel } from './user/entities/space_user_bridge.entity';
import { PostModel } from './space/post/entities/post.entity';
import { ChatModule } from './space/post/chat/chat.module';
import { ChatModel } from './space/post/chat/entities/chat.entity';
import { LogMiddleware } from './common/middleware/log.middleware';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './space/post/post.module';
import { RoleModule } from './space/role/role.module';
import { RoleModel } from './space/role/entities/role.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV=='dev' ? '.dev.env' : '.prod.env',
    }),
    TypeOrmModule.forFeature([
      UserModel, SpaceModel, RoleModel, SpaceUserBridgeModel, PostModel, ChatModel,
    ]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env[ENV_DB_HOST_KEY],
      port: +process.env[ENV_DB_PORT_KEY],
      username: process.env[ENV_DB_USERNAME_KEY],
      password: process.env[ENV_DB_PASSWORD_KEY],
      database: process.env[ENV_DB_DATABASE_KEY],
      logging: true,
      entities: [
        SpaceModel,
        UserModel,
        SpaceUserBridgeModel,
        RoleModel,
        PostModel,
        ChatModel,
      ],
      synchronize: true,

    }),
    SpaceModule,
    UserModule,
    PostModule,
    ChatModule,
    AuthModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    if (process.env.NODE_ENV === 'dev') {
      consumer.apply(LogMiddleware)
        .forRoutes({
          path: '*',
          method: RequestMethod.ALL,
        });
    }
  }
}
